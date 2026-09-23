import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const OTHER_ASSETS = [
  { symbol: "ANSEM", name: "Ansem" },
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
];

/**
 * A real asset list, not a decorative one: SOL shows its actual current
 * price and day-over-day change from the real dataset. Everything else is
 * explicitly marked unavailable rather than filled with invented numbers —
 * the architecture is ready for more datasets later, but we don't pretend
 * to have them now.
 */
export function MarketWatchlist({ solPrice, solChangePct }: { solPrice: number; solChangePct: number | null }) {
  return (
    <div className="rounded-md border border-border-strong bg-surface-elevated p-4">
      <p className="mb-3 text-caption uppercase tracking-wide text-foreground-subtle">Markets</p>
      <ul className="space-y-2.5">
        <li className="flex items-center justify-between">
          <div>
            <p className="text-body-sm font-medium text-foreground">SOL</p>
            <p className="text-caption text-foreground-subtle">Solana</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-body-sm text-foreground">${solPrice.toFixed(2)}</p>
            {solChangePct !== null && (
              <p className={cn("text-caption", solChangePct >= 0 ? "text-positive" : "text-negative")}>
                {solChangePct >= 0 ? "+" : ""}
                {solChangePct.toFixed(1)}%
              </p>
            )}
          </div>
        </li>
        {OTHER_ASSETS.map((asset) => (
          <li key={asset.symbol} className="flex items-center justify-between opacity-60">
            <div>
              <p className="text-body-sm font-medium text-foreground">{asset.symbol}</p>
              <p className="text-caption text-foreground-subtle">{asset.name}</p>
            </div>
            <Badge variant="default" className="text-caption">
              Dataset unavailable
            </Badge>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-caption text-foreground-subtle">
        We only trade markets we have verified real price data for — never invented numbers. More markets arrive as
        we add real datasets for them.
      </p>
    </div>
  );
}
