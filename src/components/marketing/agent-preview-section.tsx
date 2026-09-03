import { Activity, Shield, ListTree } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/animated-wrapper";
import { PreviewBadge } from "@/components/marketing/preview-badge";
import { Sparkline } from "@/components/marketing/sparkline";
import { Badge } from "@/components/ui/badge";
import { demoAgent } from "@/features/agents/demo-data";
import { cn } from "@/lib/utils";

function actionTone(action: string): "positive" | "negative" | "neutral" {
  if (action === "LONG") return "positive";
  if (action === "EXIT" || action === "SHORT") return "negative";
  return "neutral";
}

export function AgentPreviewSection() {
  return (
    <section className="relative border-t border-border px-6 py-24">
      <div className="mx-auto max-w-marketing">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-lg">
            <p className="mb-4 font-mono text-caption uppercase tracking-[0.2em] text-foreground-subtle">
              The agent environment
            </p>
            <h2 className="text-heading-xl text-foreground">What building an agent looks like</h2>
            <p className="mt-3 text-body-md text-foreground-muted">
              A preview of the interface — identity, market observation, decisions, and performance in one
              environment.
            </p>
          </div>
          <PreviewBadge />
        </Reveal>

        <div className="overflow-hidden rounded-md border border-border-strong bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-heading-md text-foreground">{demoAgent.name}</h3>
                <Badge variant="default">{demoAgent.status}</Badge>
              </div>
              <p className="mt-1 text-body-sm text-foreground-muted">
                {demoAgent.strategy} · {demoAgent.riskProfile} risk
              </p>
            </div>
          </div>

          <RevealGroup className="grid gap-px bg-border md:grid-cols-3">
            {/* Performance */}
            <RevealItem className="bg-surface p-6 md:col-span-2">
              <div className="mb-3 flex items-center gap-2 text-foreground-muted">
                <Activity className="size-4" aria-hidden="true" />
                <span className="text-label">Simulated performance</span>
              </div>
              <Sparkline data={demoAgent.performanceSeries} className="h-24 w-full" />
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {demoAgent.metrics.map((m) => (
                  <div key={m.label}>
                    <p
                      className={cn(
                        "text-data",
                        m.tone === "positive" && "text-positive",
                        m.tone === "negative" && "text-negative",
                        m.tone === "neutral" && "text-foreground"
                      )}
                    >
                      {m.value}
                    </p>
                    <p className="mt-0.5 text-caption text-foreground-subtle">{m.label}</p>
                  </div>
                ))}
              </div>
            </RevealItem>

            {/* Decision history */}
            <RevealItem className="bg-surface p-6">
              <div className="mb-3 flex items-center gap-2 text-foreground-muted">
                <ListTree className="size-4" aria-hidden="true" />
                <span className="text-label">Decision history</span>
              </div>
              <ul className="space-y-3">
                {demoAgent.decisions.map((d) => (
                  <li key={d.id} className="text-body-sm">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          actionTone(d.action) === "positive"
                            ? "positive"
                            : actionTone(d.action) === "negative"
                              ? "negative"
                              : "default"
                        }
                      >
                        {d.action}
                      </Badge>
                      <span className="font-mono text-caption text-foreground-subtle">{d.time}</span>
                    </div>
                    <p className="mt-1.5 text-foreground-muted">{d.reasoning}</p>
                  </li>
                ))}
              </ul>
            </RevealItem>
          </RevealGroup>

          <div className="flex items-center gap-2 border-t border-border px-6 py-3 text-caption text-foreground-subtle">
            <Shield className="size-3.5" aria-hidden="true" />
            Illustrative preview — no live agent or backend is running.
          </div>
        </div>
      </div>
    </section>
  );
}
