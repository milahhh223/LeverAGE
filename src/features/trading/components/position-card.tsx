import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PositionCard({
  side,
  entryPrice,
  currentPrice,
  allocationPct,
  allocationValue,
}: {
  side: "LONG" | "SHORT";
  entryPrice: number;
  currentPrice: number;
  allocationPct: number;
  allocationValue: number;
}) {
  const priceReturn = side === "LONG" ? (currentPrice - entryPrice) / entryPrice : (entryPrice - currentPrice) / entryPrice;
  const dollarPnl = allocationValue * priceReturn;
  const isUp = dollarPnl >= 0;

  return (
    <div className="rounded-md border border-border-strong bg-surface-elevated p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={side === "LONG" ? "positive" : "negative"}>{side}</Badge>
          <span className="text-body-sm text-foreground-muted">{allocationPct}% allocation</span>
        </div>
        <span className={cn("font-mono text-heading-md", isUp ? "text-positive" : "text-negative")}>
          {isUp ? "+" : ""}${dollarPnl.toFixed(2)}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-body-sm text-foreground-muted">
        <span>Entry ${entryPrice.toFixed(2)}</span>
        <span>→</span>
        <span className="text-foreground">Now ${currentPrice.toFixed(2)}</span>
        <span className={cn("font-medium", isUp ? "text-positive" : "text-negative")}>
          {isUp ? "+" : ""}
          {(priceReturn * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
