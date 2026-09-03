import { notFound } from "next/navigation";
import { Activity, ListTree, Shield, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { FadeIn, RevealGroup, RevealItem } from "@/components/shared/animated-wrapper";
import { PreviewBadge } from "@/components/marketing/preview-badge";
import { Sparkline } from "@/components/marketing/sparkline";
import { Badge } from "@/components/ui/badge";
import {
  AGENT_STRATEGIES,
  AGENT_MARKET_FOCUSES,
  AGENT_RISK_PROFILES,
  labelForOption,
} from "@/features/agents/constants";
import { getLatestEvaluation, type LatestEvaluation } from "@/features/evaluations/services/evaluation-queries";
import { StartEvaluationButton } from "@/features/evaluations/components/start-evaluation-button";
import { cn } from "@/lib/utils";

function actionTone(action: string): "positive" | "negative" | "neutral" {
  if (action === "LONG") return "positive";
  if (action === "EXIT" || action === "SHORT") return "negative";
  return "neutral";
}

function badgeVariant(tone: "positive" | "negative" | "neutral"): "positive" | "negative" | "default" {
  if (tone === "positive") return "positive";
  if (tone === "negative") return "negative";
  return "default";
}

/**
 * A closed trade's realized P&L equals the portfolio value change across the
 * EXIT step, since only one action happens per sequence step. This derives
 * win rate honestly from persisted snapshots rather than guessing from
 * decision metadata.
 */
function computeWinRate(latest: LatestEvaluation): { label: string; tone: "positive" | "negative" | "neutral" } {
  const valueBySequence = new Map(latest.snapshots.map((s) => [s.sequence, s.portfolio_value]));
  const exits = latest.decisions.filter((d) => d.action === "EXIT");

  if (exits.length === 0) {
    return { label: "—", tone: "neutral" };
  }

  let wins = 0;
  for (const exit of exits) {
    const after = valueBySequence.get(exit.sequence);
    const before = valueBySequence.get(exit.sequence - 1) ?? latest.evaluation.starting_capital;
    if (after !== undefined && after > before) wins += 1;
  }

  const winRate = Math.round((wins / exits.length) * 100);
  return { label: `${winRate}%`, tone: winRate >= 50 ? "positive" : "negative" };
}

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .eq("user_id", user?.id ?? "")
    .single();

  if (!agent) {
    notFound();
  }

  const latest = user ? await getLatestEvaluation(agent.id, user.id) : null;
  const winRate = latest ? computeWinRate(latest) : null;
  const maxDrawdown = latest ? Math.max(...latest.snapshots.map((s) => s.drawdown_pct), 0) : 0;
  const returnPct = latest
    ? ((latest.evaluation.current_capital - latest.evaluation.starting_capital) / latest.evaluation.starting_capital) *
      100
    : 0;

  return (
    <>
      <AppHeader title={agent.name} />
      <PageContainer>
        <FadeIn>
          {/* Real, saved agent configuration */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-heading-xl text-foreground">{agent.name}</h2>
                <Badge variant="default" className="capitalize">
                  {agent.status}
                </Badge>
              </div>
              <p className="mt-2 text-body-md text-foreground-muted">
                {labelForOption(AGENT_STRATEGIES, agent.strategy)} ·{" "}
                {labelForOption(AGENT_MARKET_FOCUSES, agent.market_focus)} ·{" "}
                {labelForOption(AGENT_RISK_PROFILES, agent.risk_profile)} risk
              </p>
            </div>
            <div className="text-right">
              <p className="text-caption uppercase tracking-wide text-foreground-subtle">Max allocation</p>
              <p className="text-data text-foreground">{agent.max_allocation_pct}%</p>
            </div>
          </div>

          {!latest && (
            <div className="rounded-md border border-border-strong bg-surface p-8 text-center">
              <TrendingUp className="mx-auto mb-4 size-6 text-foreground-subtle" aria-hidden="true" />
              <h3 className="text-heading-md text-foreground">No evaluation has been run for this agent yet.</h3>
              <p className="mx-auto mt-2 max-w-md text-body-sm text-foreground-muted">
                Starting one runs {agent.name}&apos;s strategy against a controlled sample dataset with $10,000 in
                virtual capital, and records every decision it makes along the way.
              </p>
              <div className="mt-6 flex justify-center">
                <StartEvaluationButton agentId={agent.id} />
              </div>
            </div>
          )}

          {latest && latest.evaluation.status === "running" && (
            <div className="rounded-md border border-border-strong bg-surface p-8 text-center">
              <p className="text-body-md text-foreground-muted">Running evaluation…</p>
            </div>
          )}

          {latest && latest.evaluation.status === "failed" && (
            <div className="rounded-md border border-border-strong bg-surface p-8 text-center">
              <h3 className="text-heading-md text-foreground">The last evaluation failed to complete.</h3>
              <p className="mx-auto mt-2 max-w-md text-body-sm text-foreground-muted">
                No performance data was recorded for that run. You can start a new evaluation below.
              </p>
              <div className="mt-6 flex justify-center">
                <StartEvaluationButton agentId={agent.id} />
              </div>
            </div>
          )}

          {latest && latest.evaluation.status === "completed" && winRate && (
            <div className="overflow-hidden rounded-md border border-border-strong bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
                <p className="text-body-sm text-foreground-muted">
                  Evaluation completed against a controlled sample dataset — not live market data. Started with $
                  {latest.evaluation.starting_capital.toLocaleString()} in virtual capital.
                </p>
                <div className="flex items-center gap-2">
                  <PreviewBadge label="Sample dataset" />
                  <StartEvaluationButton agentId={agent.id} />
                </div>
              </div>

              <RevealGroup className="grid gap-px bg-border md:grid-cols-3">
                <RevealItem className="bg-surface p-6 md:col-span-2">
                  <div className="mb-3 flex items-center gap-2 text-foreground-muted">
                    <Activity className="size-4" aria-hidden="true" />
                    <span className="text-label">Evaluation performance</span>
                  </div>
                  <Sparkline
                    data={latest.snapshots.map((s) => ({ t: s.sequence, value: s.portfolio_value }))}
                    className="h-24 w-full"
                  />
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Metric
                      label="Return"
                      value={`${returnPct >= 0 ? "+" : ""}${returnPct.toFixed(1)}%`}
                      tone={returnPct >= 0 ? "positive" : "negative"}
                    />
                    <Metric label="Max drawdown" value={`-${maxDrawdown.toFixed(1)}%`} tone="negative" />
                    <Metric label="Decisions logged" value={String(latest.decisions.length)} tone="neutral" />
                    <Metric label="Win rate" value={winRate.label} tone={winRate.tone} />
                  </div>
                </RevealItem>

                <RevealItem className="bg-surface p-6">
                  <div className="mb-3 flex items-center gap-2 text-foreground-muted">
                    <ListTree className="size-4" aria-hidden="true" />
                    <span className="text-label">Decision history</span>
                  </div>
                  <ul className="max-h-96 space-y-3 overflow-y-auto">
                    {[...latest.decisions]
                      .reverse()
                      .slice(0, 12)
                      .map((d) => (
                        <li key={d.id} className="text-body-sm">
                          <div className="flex items-center justify-between">
                            <Badge variant={badgeVariant(actionTone(d.action))}>{d.action}</Badge>
                            <span className="font-mono text-caption text-foreground-subtle">
                              ${d.market_price.toFixed(2)}
                            </span>
                          </div>
                          <p className="mt-1.5 text-foreground-muted">{d.reasoning}</p>
                        </li>
                      ))}
                  </ul>
                </RevealItem>
              </RevealGroup>

              <div className="flex items-center gap-2 border-t border-border px-6 py-3 text-caption text-foreground-subtle">
                <Shield className="size-3.5" aria-hidden="true" />
                Deterministic evaluation against a controlled dataset — no real capital or live market execution is
                involved.
              </div>
            </div>
          )}
        </FadeIn>
      </PageContainer>
    </>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "positive" | "negative" | "neutral";
}) {
  return (
    <div>
      <p
        className={cn(
          "text-data",
          tone === "positive" && "text-positive",
          tone === "negative" && "text-negative",
          tone === "neutral" && "text-foreground"
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-caption text-foreground-subtle">{label}</p>
    </div>
  );
}
