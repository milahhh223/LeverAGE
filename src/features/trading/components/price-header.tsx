import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function PriceHeader({
  price,
  previousPrice,
  day,
  totalDays,
}: {
  price: number;
  previousPrice: number | null;
  day: number;
  totalDays: number;
}) {
  const change = previousPrice !== null ? price - previousPrice : null;
  const changePct = previousPrice !== null && previousPrice !== 0 ? (change! / previousPrice) * 100 : null;
  const isUp = change !== null && change >= 0;
  const progressPct = totalDays > 1 ? ((day - 1) / (totalDays - 1)) * 100 : 0;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption uppercase tracking-wide text-foreground-subtle">
            SOL/USD · Day {day} of {totalDays}
          </p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="font-mono text-heading-xl text-foreground">${price.toFixed(2)}</span>
            {changePct !== null && (
              <span
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-0.5 text-body-sm font-medium",
                  isUp ? "bg-positive-muted text-positive" : "bg-negative-muted text-negative"
                )}
              >
                {isUp ? <TrendingUp className="size-3.5" aria-hidden="true" /> : <TrendingDown className="size-3.5" aria-hidden="true" />}
                {isUp ? "+" : ""}
                {changePct.toFixed(1)}%
              </span>
            )}
            {changePct === null && (
              <span className="flex items-center gap-1 rounded-md bg-surface-elevated px-2 py-0.5 text-body-sm text-foreground-subtle">
                <Minus className="size-3.5" aria-hidden="true" />
                First day
              </span>
            )}
          </div>
        </div>
        <span className="rounded-md border border-border-strong px-2 py-1 font-mono text-caption uppercase tracking-wide text-foreground-subtle">
          Historical simulation
        </span>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  );
}
