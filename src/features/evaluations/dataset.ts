/**
 * REAL HISTORICAL DATA — a fixed, frozen snapshot, not a live feed.
 *
 * Daily close prices for SOL/USD, August 6 – September 5, 2026, sourced
 * from CoinLore's exchange-aggregated historical data
 * (https://www.coinlore.com/coin/solana/historical-data, retrieved
 * 2026-09-07). This genuinely happened in the market — it is not
 * invented or randomly generated.
 *
 * It is still deliberately a *frozen* snapshot rather than a live feed:
 * fetching fresh data on every evaluation would make results
 * non-reproducible (two runs of the same agent minutes apart could
 * differ just because the market moved) and would add a live external
 * dependency that could fail exactly when someone is testing the
 * product. Reproducibility is what makes evaluations comparable to each
 * other — see docs/database-architecture.md.
 *
 * When a live or rolling-window data source is added later, it should
 * be a new dataset_id alongside this one, not a replacement — so past
 * evaluations remain explainable against the exact data they actually
 * ran against.
 */

export interface DatasetPoint {
  t: number;
  price: number;
}

export interface EvaluationDataset {
  id: string;
  label: string;
  market: "sol";
  points: readonly DatasetPoint[];
}

const SOL_HISTORICAL_PRICES: readonly number[] = [
  72.59, 73.68, 76.04, 76.26, 76.0, 76.24, 75.6, 76.22, 75.39, 75.34, 74.61, 76.02, 77.07, 85.41, 87.67, 93.64, 93.95,
  95.41, 98.46, 96.56, 102.09, 109.22, 104.12, 105.63, 101.81, 103.01, 100.03, 100.39, 103.93, 103.11,
];

export const SOL_HISTORICAL_DATASET: EvaluationDataset = {
  id: "sol_2026_08_v1",
  label: "SOL daily closes, Aug 6 – Sep 5 2026 (CoinLore)",
  market: "sol",
  points: SOL_HISTORICAL_PRICES.map((price, t) => ({ t, price })),
};

const DATASETS_BY_ID: Record<string, EvaluationDataset> = {
  [SOL_HISTORICAL_DATASET.id]: SOL_HISTORICAL_DATASET,
};

export function getDataset(market: "sol"): EvaluationDataset {
  // Only one dataset exists today; the market parameter is threaded through
  // now so adding a second market later doesn't require touching callers.
  void market;
  return SOL_HISTORICAL_DATASET;
}

export function getDatasetById(id: string): EvaluationDataset | undefined {
  return DATASETS_BY_ID[id];
}
