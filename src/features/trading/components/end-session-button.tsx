"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { endSessionAction } from "@/features/trading/services/trading-actions";

export function EndSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [isEnding, setIsEnding] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleConfirm() {
    setError(null);
    setIsEnding(true);
    const result = await endSessionAction(sessionId);
    setIsEnding(false);
    if (!result.success) {
      setError(result.error ?? "Couldn't end the session. Try again.");
      return;
    }
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-body-sm text-foreground-muted">End now and close any open position?</span>
        <Button variant="destructive" size="sm" onClick={handleConfirm} loading={isEnding}>
          Yes, end it
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
        {error && <span className="text-body-sm text-negative">{error}</span>}
      </div>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
      End session early
    </Button>
  );
}
