"use client";

import * as React from "react";
import { Trophy } from "lucide-react";
import { Select } from "@/components/ui/select";
import { ComparisonChart } from "@/features/trading/components/comparison-chart";
import { cn } from "@/lib/utils";
import type { ComparableAgentEvaluation } from "@/features/trading/types";

interface HumanSummary {
  returnPct: number;
  maxDrawdownPct: number;
  snapshots: { sequence: number; portfolioValue: number }[];
}

function Fighter({
  label,
  returnPct,
  maxDrawdownPct,
  isWinner,
  align,
}: {
  label: string;
  returnPct: number;
  maxDrawdownPct: number;
  isWinner: boolean;
  align: "left" | "right";
}) {
  return (
    <div className={cn("flex flex-col", align === "right" && "items-end text-right")}>
      <div className="flex items-center gap-1.5">
        {isWinner && align === "left" && <Trophy className="size-4 text-warning" aria-hidden="true" />}
        <p className="text-label uppercase tracking-wide text-foreground-muted">{label}</p>
        {isWinner && align === "right" && <Trophy className="size-4 text-warning" aria-hidden="true" />}
      </div>
      <p className={cn("mt-1 font-mono text-heading-xl", returnPct >= 0 ? "text-positive" : "text-negative")}>
        {returnPct >= 0 ? "+" : ""}
        {returnPct.toFixed(1)}%
      </p>
      <p className="mt-1 text-body-sm text-foreground-subtle">-{maxDrawdownPct.toFixed(1)}% max drawdown</p>
    </div>
  );
}

export function ComparisonPicker({
  human,
  agentEvaluations,
}: {
  human: HumanSummary;
  agentEvaluations: ComparableAgentEvaluation[];
}) {
  const [selectedId, setSelectedId] = React.useState<string>(agentEvaluations[0]?.evaluationId ?? "");
  const selected = agentEvaluations.find((a) => a.evaluationId === selectedId);

  if (agentEvaluations.length === 0) {
    return (
      <p className="text-body-sm text-foreground-muted">
        You don&apos;t have any completed agent evaluations yet — create an agent and run an evaluation to compare
        it against this session.
      </p>
    );
  }

  const humanWins = selected ? human.returnPct > selected.returnPct : false;
  const tie = selected ? human.returnPct === selected.returnPct : false;

  return (
    <div>
      <Select
        options={agentEvaluations.map((a) => ({ value: a.evaluationId, label: a.agentName }))}
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="max-w-xs"
      />

      {selected && (
        <div className="mt-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-md border border-border-strong bg-surface-elevated p-6">
            <Fighter label="You" returnPct={human.returnPct} maxDrawdownPct={human.maxDrawdownPct} isWinner={humanWins} align="left" />
            <span className="font-mono text-caption text-foreground-subtle">VS</span>
            <Fighter
              label={selected.agentName}
              returnPct={selected.returnPct}
              maxDrawdownPct={selected.maxDrawdownPct}
              isWinner={!humanWins && !tie}
              align="right"
            />
          </div>

          <div className="mt-6">
            <ComparisonChart
              series={[
                { label: "You", color: "var(--primary)", points: human.snapshots.map((s) => ({ sequence: s.sequence, value: s.portfolioValue })) },
                {
                  label: selected.agentName,
                  color: "var(--foreground-subtle)",
                  points: selected.snapshots.map((s) => ({ sequence: s.sequence, value: s.portfolioValue })),
                },
              ]}
            />
          </div>

          <p
            className={cn(
              "mt-4 rounded-md px-3 py-2 text-body-sm font-medium",
              tie ? "bg-surface-elevated text-foreground-muted" : humanWins ? "bg-positive-muted text-positive" : "bg-negative-muted text-negative"
            )}
          >
            {tie
              ? `You and ${selected.agentName} finished dead even.`
              : humanWins
                ? `You beat ${selected.agentName} by ${(human.returnPct - selected.returnPct).toFixed(1)} points of return.`
                : `${selected.agentName} beat you by ${(selected.returnPct - human.returnPct).toFixed(1)} points of return.`}
          </p>
        </div>
      )}
    </div>
  );
}
