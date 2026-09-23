import type { DatasetPoint } from "@/features/evaluations/dataset";
import { round, unrealizedPnl, computeSnapshot, type OpenPosition } from "@/features/evaluations/portfolio-math";
import type {
  DecisionAction,
  EngineDecision,
  EngineSnapshot,
  EvaluationAgentConfig,
  EvaluationRunResult,
  EvaluationSummary,
} from "@/features/evaluations/types";

/**
 * Deterministic evaluation engine.
 *
 * Given an agent's saved configuration and a fixed price series, this
 * produces the exact same decisions, snapshots, and summary every time —
 * there is no randomness anywhere in this file. These are simple,
 * explainable rules (momentum / mean-reversion / trend-following /
 * hybrid), not a sophisticated financial model, and are not a claim that
 * any of them are profitable. The point of Phase 3 is that decisions are
 * real, persisted, and traceable — not that the strategies are good.
 */

const WARMUP = 7; // smallest index with enough history for every strategy's lookback

interface RiskConfig {
  thresholdMultiplier: number; // >1 = needs a bigger signal to act (stricter)
  allocationFactor: number; // 0..1 = share of the agent's max allocation actually used
}

const RISK_CONFIG: Record<string, RiskConfig> = {
  conservative: { thresholdMultiplier: 1.6, allocationFactor: 0.5 },
  balanced: { thresholdMultiplier: 1.0, allocationFactor: 0.75 },
  aggressive: { thresholdMultiplier: 0.6, allocationFactor: 1.0 },
};

const BASE_THRESHOLDS = {
  momentum: 0.012, // 1.2% move over 3 steps
  meanReversion: 0.02, // 2% deviation from the 5-step average
  trendFollowing: 0.01, // 1% gap between the 3-step and 7-step averages
};

function priceAt(points: readonly DatasetPoint[], index: number): number {
  const point = points[index];
  if (!point) {
    throw new Error(`Evaluation engine: dataset index ${index} out of range.`);
  }
  return point.price;
}

function average(points: readonly DatasetPoint[], fromInclusive: number, toInclusive: number): number {
  let sum = 0;
  let count = 0;
  for (let i = fromInclusive; i <= toInclusive; i++) {
    sum += priceAt(points, i);
    count++;
  }
  return sum / count;
}

function clampConfidence(value: number, threshold: number): number {
  const strength = Math.abs(value) / threshold - 1;
  return Math.min(0.95, Math.max(0.55, 0.55 + strength * 0.2));
}

interface Signal {
  action: Exclude<DecisionAction, "EXIT">;
  observation: string;
  reasoning: string;
  confidence: number;
}

function momentumSignal(points: readonly DatasetPoint[], i: number, threshold: number): Signal {
  const past = priceAt(points, i - 3);
  const current = priceAt(points, i);
  const change = (current - past) / past;
  const pct = (change * 100).toFixed(1);

  if (change > threshold) {
    return {
      action: "LONG",
      observation: `Price rose ${pct}% over the last 3 steps.`,
      reasoning: "Momentum signal crossed the bullish threshold.",
      confidence: clampConfidence(change, threshold),
    };
  }
  if (change < -threshold) {
    return {
      action: "SHORT",
      observation: `Price fell ${Math.abs(Number(pct))}% over the last 3 steps.`,
      reasoning: "Momentum signal crossed the bearish threshold.",
      confidence: clampConfidence(change, threshold),
    };
  }
  return {
    action: "HOLD",
    observation: `Price moved ${pct}% over the last 3 steps — inside the neutral band.`,
    reasoning: "No momentum threshold crossed.",
    confidence: 0.5,
  };
}

function meanReversionSignal(points: readonly DatasetPoint[], i: number, threshold: number): Signal {
  const avg = average(points, i - 5, i - 1);
  const current = priceAt(points, i);
  const deviation = (current - avg) / avg;
  const pct = (Math.abs(deviation) * 100).toFixed(1);

  if (deviation > threshold) {
    return {
      action: "SHORT",
      observation: `Price is ${pct}% above its 5-step average.`,
      reasoning: "Overextension above average suggests reversion downward.",
      confidence: clampConfidence(deviation, threshold),
    };
  }
  if (deviation < -threshold) {
    return {
      action: "LONG",
      observation: `Price is ${pct}% below its 5-step average.`,
      reasoning: "Overextension below average suggests reversion upward.",
      confidence: clampConfidence(deviation, threshold),
    };
  }
  return {
    action: "HOLD",
    observation: `Price is within ${pct}% of its 5-step average.`,
    reasoning: "No mean-reversion threshold crossed.",
    confidence: 0.5,
  };
}

function trendFollowingSignal(points: readonly DatasetPoint[], i: number, threshold: number): Signal {
  const shortMA = average(points, i - 2, i);
  const longMA = average(points, i - 6, i);
  const gap = (shortMA - longMA) / longMA;
  const pct = (Math.abs(gap) * 100).toFixed(1);

  if (gap > threshold) {
    return {
      action: "LONG",
      observation: `3-step average is ${pct}% above the 7-step average.`,
      reasoning: "Short-term trend confirmed above the long-term trend.",
      confidence: clampConfidence(gap, threshold),
    };
  }
  if (gap < -threshold) {
    return {
      action: "SHORT",
      observation: `3-step average is ${pct}% below the 7-step average.`,
      reasoning: "Short-term trend confirmed below the long-term trend.",
      confidence: clampConfidence(gap, threshold),
    };
  }
  return {
    action: "HOLD",
    observation: `3-step and 7-step averages are within ${pct}% of each other.`,
    reasoning: "No confirmed trend.",
    confidence: 0.5,
  };
}

function hybridSignal(
  points: readonly DatasetPoint[],
  i: number,
  momentumThreshold: number,
  reversionThreshold: number
): Signal {
  const m = momentumSignal(points, i, momentumThreshold);
  const r = meanReversionSignal(points, i, reversionThreshold);

  if (m.action !== "HOLD" && m.action === r.action) {
    return {
      action: m.action,
      observation: `${m.observation} ${r.observation}`,
      reasoning: "Momentum and mean-reversion signals agree.",
      confidence: Math.min(0.95, (m.confidence + r.confidence) / 2 + 0.1),
    };
  }
  if (m.action !== "HOLD" && r.action === "HOLD") {
    return { ...m, reasoning: `${m.reasoning} (mean-reversion neutral)`, confidence: m.confidence * 0.85 };
  }
  if (r.action !== "HOLD" && m.action === "HOLD") {
    return { ...r, reasoning: `${r.reasoning} (momentum neutral)`, confidence: r.confidence * 0.85 };
  }
  return {
    action: "HOLD",
    observation: `${m.observation} ${r.observation}`,
    reasoning: "Momentum and mean-reversion signals disagree — staying flat.",
    confidence: 0.5,
  };
}

function getSignal(strategy: string, points: readonly DatasetPoint[], i: number, risk: RiskConfig): Signal {
  switch (strategy) {
    case "momentum":
      return momentumSignal(points, i, BASE_THRESHOLDS.momentum * risk.thresholdMultiplier);
    case "mean_reversion":
      return meanReversionSignal(points, i, BASE_THRESHOLDS.meanReversion * risk.thresholdMultiplier);
    case "trend_following":
      return trendFollowingSignal(points, i, BASE_THRESHOLDS.trendFollowing * risk.thresholdMultiplier);
    case "hybrid":
    default:
      return hybridSignal(
        points,
        i,
        BASE_THRESHOLDS.momentum * risk.thresholdMultiplier,
        BASE_THRESHOLDS.meanReversion * risk.thresholdMultiplier
      );
  }
}

export function runEvaluation(
  agent: EvaluationAgentConfig,
  points: readonly DatasetPoint[],
  startingCapital: number
): EvaluationRunResult {
  const risk = RISK_CONFIG[agent.riskProfile] ?? RISK_CONFIG.balanced!;
  const lastIndex = points.length - 1;

  let capital = startingCapital;
  let peak = startingCapital;
  let position: OpenPosition | null = null;
  let wins = 0;
  let closedTrades = 0;

  const decisions: EngineDecision[] = [];
  const snapshots: EngineSnapshot[] = [];

  for (let i = WARMUP; i <= lastIndex; i++) {
    const price = priceAt(points, i);
    const signal = getSignal(agent.strategy, points, i, risk);
    const isLast = i === lastIndex;

    let action: DecisionAction;
    let allocationPct: number;
    let observation = signal.observation;
    let reasoning = signal.reasoning;
    let confidence = signal.confidence;

    if (position) {
      const opposite =
        (position.side === "LONG" && signal.action === "SHORT") ||
        (position.side === "SHORT" && signal.action === "LONG");

      if (isLast || opposite) {
        const realizedPnl = unrealizedPnl(position, price);
        capital += realizedPnl;
        closedTrades += 1;
        if (realizedPnl > 0) wins += 1;

        action = "EXIT";
        allocationPct = position.allocationPct;
        observation = `Position closed at ${price.toFixed(2)}, entered at ${position.entryPrice.toFixed(2)}.`;
        reasoning =
          isLast && !opposite
            ? "Evaluation window ended; closing the open position to realize results."
            : `Opposing signal triggered exit: ${signal.reasoning.toLowerCase()}`;
        confidence = 0.6;
        position = null;
      } else {
        action = "HOLD";
        allocationPct = position.allocationPct;
        reasoning = `Holding the open ${position.side} position — no exit condition met.`;
        confidence = 0.55;
      }
    } else if (signal.action === "LONG" || signal.action === "SHORT") {
      allocationPct = Math.max(1, Math.round(agent.maxAllocationPct * risk.allocationFactor));
      const allocationValue = startingCapital * (allocationPct / 100);
      position = { side: signal.action, entryPrice: price, allocationPct, allocationValue };
      action = signal.action;
    } else {
      action = "HOLD";
      allocationPct = 0;
    }

    decisions.push({
      sequence: i,
      marketPrice: round(price, 4),
      observation,
      reasoning,
      action,
      confidence: round(confidence, 3),
      allocationPct,
    });

    const snapshot = computeSnapshot({ capital, position, price, startingCapital, peak });
    peak = snapshot.peak;

    snapshots.push({
      sequence: i,
      portfolioValue: snapshot.portfolioValue,
      returnPct: snapshot.returnPct,
      drawdownPct: snapshot.drawdownPct,
    });
  }

  const finalSnapshot = snapshots[snapshots.length - 1];
  const maxDrawdownPct = snapshots.reduce((max, s) => Math.max(max, s.drawdownPct), 0);

  const summary: EvaluationSummary = {
    finalCapital: round(capital, 2),
    returnPct: finalSnapshot ? finalSnapshot.returnPct : 0,
    maxDrawdownPct: round(maxDrawdownPct, 3),
    decisionsLogged: decisions.length,
    closedTrades,
    winRate: closedTrades > 0 ? round((wins / closedTrades) * 100, 1) : null,
  };

  return { decisions, snapshots, summary };
}
