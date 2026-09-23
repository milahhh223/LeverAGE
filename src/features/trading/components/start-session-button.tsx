"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { startTradingSessionAction } from "@/features/trading/services/trading-actions";

export function StartSessionButton() {
  const [isStarting, setIsStarting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setIsStarting(true);
    const result = await startTradingSessionAction();
    // On success this redirects server-side and never returns here.
    if (!result.success) {
      setError(result.error ?? "Couldn't start a trading session. Try again.");
      setIsStarting(false);
    }
  }

  return (
    <div>
      <Button onClick={handleClick} loading={isStarting}>
        Start a trading session
      </Button>
      {error && (
        <p role="alert" className="mt-3 rounded-md bg-negative-muted px-3 py-2 text-body-sm text-negative">
          {error}
        </p>
      )}
    </div>
  );
}
