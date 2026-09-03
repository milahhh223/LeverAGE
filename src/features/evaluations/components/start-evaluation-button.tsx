"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { startEvaluationAction } from "@/features/evaluations/services/evaluation-actions";

export function StartEvaluationButton({ agentId }: { agentId: string }) {
  const router = useRouter();
  const [isRunning, setIsRunning] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setIsRunning(true);

    const result = await startEvaluationAction(agentId);

    setIsRunning(false);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error ?? "Couldn't start the evaluation. Try again.");
    }
  }

  return (
    <div>
      <Button onClick={handleClick} loading={isRunning}>
        {isRunning ? "Running evaluation…" : "Start evaluation"}
      </Button>
      {error && (
        <p role="alert" className="mt-3 rounded-md bg-negative-muted px-3 py-2 text-body-sm text-negative">
          {error}
        </p>
      )}
    </div>
  );
}
