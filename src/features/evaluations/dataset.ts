/**
 * CONTROLLED SAMPLE DATASET — NOT LIVE MARKET DATA.
 *
 * A fixed, hand-authored SOL price series used to run deterministic agent
 * evaluations. It never changes at runtime and contains no randomness, so
 * the same agent configuration run against this dataset always produces
 * the exact same evaluation result — that reproducibility is the point.
 *
 * The series is shaped to give every strategy something real to react to:
 * a sustained uptrend (steps 0–9), a pullback that overshoots the recent
 * average (steps 10–17, a mean-reversion setup), then a recovery trend
 * (steps 18–29).
 *
 * When a real historical or live market data provider is integrated,
 * evaluations should reference a `dataset_id` for that provider instead —
 * nothing about the evaluation engine's interface needs to change.
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

const SOL_SAMPLE_PRICES: readonly number[] = [
  142.1, 143.4, 145.2, 144.8, 147.1, 149.5, 151.2, 150.4, 153.8, 156.2, 158.9, 157.3, 154.1, 150.8, 148.2, 145.6,
  143.9, 146.3, 149.1, 152.4, 155.8, 154.2, 151.9, 153.6, 157.2, 160.4, 163.1, 161.8, 165.3, 168.9,
];

export const SOL_SAMPLE_DATASET: EvaluationDataset = {
  id: "sol_sample_v1",
  label: "Controlled SOL sample dataset (v1)",
  market: "sol",
  points: SOL_SAMPLE_PRICES.map((price, t) => ({ t, price })),
};

const DATASETS_BY_ID: Record<string, EvaluationDataset> = {
  [SOL_SAMPLE_DATASET.id]: SOL_SAMPLE_DATASET,
};

export function getDataset(market: "sol"): EvaluationDataset {
  // Only one dataset exists today; the market parameter is threaded through
  // now so adding a second market later doesn't require touching callers.
  void market;
  return SOL_SAMPLE_DATASET;
}

export function getDatasetById(id: string): EvaluationDataset | undefined {
  return DATASETS_BY_ID[id];
}
