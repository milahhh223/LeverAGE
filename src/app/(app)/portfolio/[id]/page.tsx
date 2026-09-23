import { notFound } from "next/navigation";
import { ListTree, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { FadeIn, RevealGroup, RevealItem } from "@/components/shared/animated-wrapper";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/marketing/sparkline";
import { getDatasetById, getDataset } from "@/features/evaluations/dataset";
import { unrealizedPnl } from "@/features/evaluations/portfolio-math";
import { getTradingSessionDetail, getComparableAgentEvaluations } from "@/features/trading/services/trading-queries";
import { TradeForm } from "@/features/trading/components/trade-form";
import { EndSessionButton } from "@/features/trading/components/end-session-button";
import { ComparisonPicker } from "@/features/trading/components/comparison-picker";
import { PriceChart } from "@/features/trading/components/price-chart";
import { PriceHeader } from "@/features/trading/components/price-header";
import { PositionCard } from "@/features/trading/components/position-card";
import { MarketWatchlist } from "@/features/trading/components/market-watchlist";
import { HowItWorks } from "@/features/trading/components/how-it-works";
import { cn } from "@/lib/utils";
import type { EvaluationDecisionRow, EvaluationSnapshotRow } from "@/types/database";

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

function computeWinRate(
  decisions: EvaluationDecisionRow[],
  snapshots: EvaluationSnapshotRow[],
  startingCapital: number
): { label: string; tone: "positive" | "negative" | "neutral" } {
  const valueBySequence = new Map(snapshots.map((s) => [s.sequence, s.portfolio_value]));
  const exits = decisions.filter((d) => d.action === "EXIT");
  if (exits.length === 0) return { label: "—", tone: "neutral" };

  let wins = 0;
  for (const exit of exits) {
    const after = valueBySequence.get(exit.sequence);
    const before = valueBySequence.get(exit.sequence - 1) ?? startingCapital;
    if (after !== undefined && after > before) wins += 1;
  }
  const winRate = Math.round((wins / exits.length) * 100);
  return { label: `${winRate}%`, tone: winRate >= 50 ? "positive" : "negative" };
}

export default async function TradingSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const detail = await getTradingSessionDetail(id, user.id);
  if (!detail) notFound();

  const { session, decisions, snapshots } = detail;
  const dataset = getDatasetById(session.dataset_id) ?? getDataset("sol");
  const lastIndex = dataset.points.length - 1;

  if (session.status === "running") {
    const seenPoints = dataset.points.slice(0, session.current_sequence + 1);
    const todayPrice = dataset.points[session.current_sequence]?.price ?? 0;
    const previousPrice = session.current_sequence > 0 ? (dataset.points[session.current_sequence - 1]?.price ?? null) : null;
    const hasPosition = session.position_side !== null;

    // Available cash is a display-only derivation — the underlying stored
    // current_capital and the verified return/drawdown math are untouched.
    // While a position is open, its allocation is "committed" (shown
    // separately) rather than looking like untouched, spendable capital.
    const positionValue = hasPosition
      ? session.position_allocation_value! +
        unrealizedPnl(
          {
            side: session.position_side as "LONG" | "SHORT",
            entryPrice: session.position_entry_price!,
            allocationPct: session.position_allocation_pct!,
            allocationValue: session.position_allocation_value!,
          },
          todayPrice
        )
      : 0;
    const availableCash = session.current_capital - (hasPosition ? session.position_allocation_value! : 0);
    const totalEquity = availableCash + positionValue;

    return (
      <>
        <AppHeader title="Trading session" />
        <PageContainer>
          <FadeIn>
            <div className="mb-6">
              <HowItWorks />
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-body-sm text-foreground-muted">Historical simulation · real SOL price history, Aug 6 – Sep 5 2026</p>
              <EndSessionButton sessionId={session.id} />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Total equity" value={`$${totalEquity.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
              <StatCard label="Available" value={`$${availableCash.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
              <StatCard label="In position" value={hasPosition ? `$${positionValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—"} />
              <StatCard
                label="Return"
                value={`${totalEquity >= session.starting_capital ? "+" : ""}${(((totalEquity - session.starting_capital) / session.starting_capital) * 100).toFixed(1)}%`}
                tone={totalEquity >= session.starting_capital ? "positive" : "negative"}
              />
            </div>

            <div key={session.current_sequence} className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <RevealItem className="rounded-md border border-border-strong bg-surface p-6">
                <PriceHeader price={todayPrice} previousPrice={previousPrice} day={session.current_sequence + 1} totalDays={lastIndex + 1} />

                <div className="mt-4">
                  {seenPoints.length >= 2 ? (
                    <PriceChart points={seenPoints.map((p) => ({ t: p.t, price: p.price }))} />
                  ) : (
                    <p className="flex h-48 items-center text-body-sm text-foreground-subtle">
                      The chart fills in as more days pass.
                    </p>
                  )}
                </div>

                {hasPosition && (
                  <div className="mt-4">
                    <PositionCard
                      side={session.position_side as "LONG" | "SHORT"}
                      entryPrice={session.position_entry_price!}
                      currentPrice={todayPrice}
                      allocationPct={session.position_allocation_pct!}
                      allocationValue={session.position_allocation_value!}
                    />
                  </div>
                )}

                {decisions.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-2 flex items-center gap-2 text-foreground-muted">
                      <ListTree className="size-4" aria-hidden="true" />
                      <span className="text-label">Your decisions so far</span>
                    </div>
                    <ul className="max-h-48 space-y-3 overflow-y-auto">
                      {[...decisions].reverse().map((d) => (
                        <li key={d.id} className="text-body-sm">
                          <div className="flex items-center justify-between">
                            <Badge variant={badgeVariant(actionTone(d.action))}>{d.action}</Badge>
                            <span className="font-mono text-caption text-foreground-subtle">${d.market_price.toFixed(2)}</span>
                          </div>
                          {d.reasoning && <p className="mt-1.5 text-foreground-muted">{d.reasoning}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </RevealItem>

              <div className="space-y-6">
                <RevealItem>
                  <MarketWatchlist
                    solPrice={todayPrice}
                    solChangePct={previousPrice !== null && previousPrice !== 0 ? ((todayPrice - previousPrice) / previousPrice) * 100 : null}
                  />
                </RevealItem>
                <RevealItem className="rounded-md border border-border-strong bg-surface p-6">
                  <TradeForm sessionId={session.id} hasPosition={hasPosition} isLastStep={session.current_sequence === lastIndex} />
                </RevealItem>
              </div>
            </div>
          </FadeIn>
        </PageContainer>
      </>
    );
  }

  // Completed
  const returnPct =
    session.starting_capital > 0
      ? ((session.current_capital - session.starting_capital) / session.starting_capital) * 100
      : 0;
  const maxDrawdown = Math.max(...snapshots.map((s) => s.drawdown_pct), 0);
  const winRate = computeWinRate(decisions, snapshots, session.starting_capital);
  const comparableAgents = await getComparableAgentEvaluations(user.id);

  return (
    <>
      <AppHeader title="Trading session" />
      <PageContainer>
        <FadeIn>
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-heading-xl text-foreground">
                  {new Date(session.created_at).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                </h2>
                <Badge variant="default">Completed</Badge>
              </div>
              <p className="mt-2 text-body-md text-foreground-muted">
                Human trading session · SOL · real historical data (Aug 6 – Sep 5, 2026)
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-border-strong bg-surface">
            <RevealGroup className="grid gap-px bg-border md:grid-cols-3">
              <RevealItem className="bg-surface p-6 md:col-span-2">
                <div className="mb-3 flex items-center gap-2 text-foreground-muted">
                  <TrendingUp className="size-4" aria-hidden="true" />
                  <span className="text-label">Your performance</span>
                </div>
                {snapshots.length >= 2 ? (
                  <Sparkline data={snapshots.map((s) => ({ t: s.sequence, value: s.portfolio_value }))} className="h-24 w-full" />
                ) : (
                  <p className="flex h-24 items-center text-body-sm text-foreground-subtle">
                    This session ended with no trades, so there&apos;s nothing to chart.
                  </p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Metric label="Return" value={`${returnPct >= 0 ? "+" : ""}${returnPct.toFixed(1)}%`} tone={returnPct >= 0 ? "positive" : "negative"} />
                  <Metric label="Max drawdown" value={`-${maxDrawdown.toFixed(1)}%`} tone="negative" />
                  <Metric label="Decisions logged" value={String(decisions.length)} tone="neutral" />
                  <Metric label="Win rate" value={winRate.label} tone={winRate.tone} />
                </div>
              </RevealItem>

              <RevealItem className="bg-surface p-6">
                <div className="mb-3 flex items-center gap-2 text-foreground-muted">
                  <ListTree className="size-4" aria-hidden="true" />
                  <span className="text-label">Decision history</span>
                </div>
                <ul className="max-h-96 space-y-3 overflow-y-auto">
                  {[...decisions].reverse().map((d) => (
                    <li key={d.id} className="text-body-sm">
                      <div className="flex items-center justify-between">
                        <Badge variant={badgeVariant(actionTone(d.action))}>{d.action}</Badge>
                        <span className="font-mono text-caption text-foreground-subtle">${d.market_price.toFixed(2)}</span>
                      </div>
                      {d.reasoning && <p className="mt-1.5 text-foreground-muted">{d.reasoning}</p>}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            </RevealGroup>
          </div>

          {snapshots.length >= 2 && (
            <div className="mt-6 rounded-md border border-border-strong bg-surface p-6">
              <h3 className="mb-4 text-heading-md text-foreground">Compare with an agent</h3>
              <ComparisonPicker
                human={{ returnPct, maxDrawdownPct: maxDrawdown, snapshots: snapshots.map((s) => ({ sequence: s.sequence, portfolioValue: s.portfolio_value })) }}
                agentEvaluations={comparableAgents}
              />
            </div>
          )}
        </FadeIn>
      </PageContainer>
    </>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone?: "positive" | "negative" }) {
  return (
    <div className="rounded-md border border-border-strong bg-surface p-3">
      <p className="text-caption uppercase tracking-wide text-foreground-subtle">{label}</p>
      <p
        className={cn(
          "mt-1 font-mono text-body-lg",
          tone === "positive" && "text-positive",
          tone === "negative" && "text-negative",
          !tone && "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "positive" | "negative" | "neutral" }) {
  return (
    <div>
      <p className={cn("text-data", tone === "positive" && "text-positive", tone === "negative" && "text-negative", tone === "neutral" && "text-foreground")}>
        {value}
      </p>
      <p className="mt-0.5 text-caption text-foreground-subtle">{label}</p>
    </div>
  );
}
