/**
 * Shared position/portfolio math.
 *
 * Extracted out of the deterministic agent engine so that human trading
 * sessions use the exact same P&L, return, and drawdown formulas an
 * agent evaluation does. That's what makes a human session and an agent
 * evaluation genuinely comparable on the same chart — same dataset, same
 * math, different decision-maker.
 */

export interface OpenPosition {
  side: "LONG" | "SHORT";
  entryPrice: number;
  allocationPct: number;
  allocationValue: number;
}

export function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function unrealizedPnl(position: OpenPosition, currentPrice: number): number {
  const priceReturn =
    position.side === "LONG"
      ? (currentPrice - position.entryPrice) / position.entryPrice
      : (position.entryPrice - currentPrice) / position.entryPrice;
  return position.allocationValue * priceReturn;
}

export interface SnapshotInput {
  capital: number;
  position: OpenPosition | null;
  price: number;
  startingCapital: number;
  peak: number;
}

export interface SnapshotResult {
  portfolioValue: number;
  returnPct: number;
  drawdownPct: number;
  peak: number;
}

/** Marks a position to market and computes the resulting snapshot values. */
export function computeSnapshot({ capital, position, price, startingCapital, peak }: SnapshotInput): SnapshotResult {
  const unrealized = position ? unrealizedPnl(position, price) : 0;
  const portfolioValue = capital + unrealized;
  const newPeak = Math.max(peak, portfolioValue);
  const drawdownPct = newPeak > 0 ? ((newPeak - portfolioValue) / newPeak) * 100 : 0;
  const returnPct = ((portfolioValue - startingCapital) / startingCapital) * 100;

  return {
    portfolioValue: round(portfolioValue, 2),
    returnPct: round(returnPct, 3),
    drawdownPct: round(drawdownPct, 3),
    peak: newPeak,
  };
}
