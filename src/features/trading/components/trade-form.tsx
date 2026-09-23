"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { submitTradeAction } from "@/features/trading/services/trading-actions";
import type { TradeAction } from "@/features/trading/types";

const ACTION_LABEL: Record<TradeAction, string> = {
  LONG: "Go long",
  SHORT: "Go short",
  HOLD: "Hold",
  EXIT: "Exit position",
};

const ACTION_DESCRIPTION: Record<TradeAction, string> = {
  LONG: "You're betting the price goes up. You profit if it rises, lose if it falls.",
  SHORT: "You're betting the price goes down. You profit if it falls, lose if it rises.",
  HOLD: "Do nothing today. If you're already in a position, it stays open exactly as it is.",
  EXIT: "Close your open position right now and lock in today's result — win or lose.",
};

export function TradeForm({
  sessionId,
  hasPosition,
  isLastStep,
}: {
  sessionId: string;
  hasPosition: boolean;
  isLastStep: boolean;
}) {
  const forcedFinalExit = hasPosition && isLastStep;
  const router = useRouter();
  const availableActions: TradeAction[] = hasPosition
    ? ["HOLD", "EXIT"]
    : isLastStep
      ? ["HOLD"]
      : ["LONG", "SHORT", "HOLD"];

  const [action, setAction] = React.useState<TradeAction>(availableActions[0]!);
  const [allocationPct, setAllocationPct] = React.useState(25);
  const [confidencePct, setConfidencePct] = React.useState(70);
  const [reasoning, setReasoning] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const needsAllocation = action === "LONG" || action === "SHORT";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("action", action);
    formData.set("allocationPct", String(allocationPct));
    formData.set("confidencePct", String(confidencePct));
    formData.set("reasoning", reasoning);

    const result = await submitTradeAction(sessionId, formData);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Couldn't record that trade. Try again.");
      return;
    }

    setReasoning("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {forcedFinalExit && (
        <p className="rounded-md bg-warning-muted px-3 py-2 text-body-sm text-warning">
          This is the final day — your open position will be closed automatically to realize results, regardless of
          what you choose below.
        </p>
      )}

      {hasPosition && !forcedFinalExit && (
        <p className="rounded-md bg-surface-elevated px-3 py-2 text-body-sm text-foreground-muted">
          You already have an open position, so Long and Short aren&apos;t available — you can only Hold it or Exit
          to close it and lock in the result.
        </p>
      )}

      {!hasPosition && isLastStep && (
        <p className="rounded-md bg-surface-elevated px-3 py-2 text-body-sm text-foreground-muted">
          This is the final day, so there&apos;s no day left to open a new position and later exit it — Hold is the
          only option.
        </p>
      )}

      <div>
        <p className="mb-2 text-caption uppercase tracking-wide text-foreground-subtle">Your move</p>
        <div className="flex flex-wrap gap-2">
          {availableActions.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAction(a)}
              className={cn(
                "rounded-md border px-3 py-2 text-body-sm font-medium transition-colors",
                action === a
                  ? "border-primary bg-primary-muted text-primary"
                  : "border-border-strong bg-surface text-foreground-muted hover:text-foreground"
              )}
            >
              {ACTION_LABEL[a]}
            </button>
          ))}
        </div>
        <p className="mt-2 text-body-sm text-foreground-muted">{ACTION_DESCRIPTION[action]}</p>
      </div>

      {needsAllocation && (
        <div>
          <label htmlFor="allocationPct" className="mb-1.5 block text-body-sm text-foreground-muted">
            Allocation — {allocationPct}% of starting capital
          </label>
          <p className="mb-1.5 text-caption text-foreground-subtle">
            How much of your $10,000 to put into this trade. Higher allocation means bigger wins and bigger losses.
          </p>
          <input
            id="allocationPct"
            type="range"
            min={1}
            max={100}
            value={allocationPct}
            onChange={(e) => setAllocationPct(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      )}

      <div>
        <label htmlFor="confidencePct" className="mb-1.5 block text-body-sm text-foreground-muted">
          How confident are you? — {confidencePct}%
        </label>
        <input
          id="confidencePct"
          type="range"
          min={0}
          max={100}
          value={confidencePct}
          onChange={(e) => setConfidencePct(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <div>
        <label htmlFor="reasoning" className="mb-1.5 block text-body-sm text-foreground-muted">
          Your reasoning <span className="text-foreground-subtle">(optional)</span>
        </label>
        <textarea
          id="reasoning"
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          rows={2}
          placeholder="Why this move?"
          className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-body-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus-visible:border-primary"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-negative-muted px-3 py-2 text-body-sm text-negative">
          {error}
        </p>
      )}

      <Button type="submit" loading={isSubmitting} className="w-full">
        Confirm {ACTION_LABEL[action].toLowerCase()}
      </Button>
    </form>
  );
}
