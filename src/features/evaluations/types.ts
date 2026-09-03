export type DecisionAction = "LONG" | "SHORT" | "HOLD" | "EXIT";

export interface EngineDecision {
  sequence: number;
  marketPrice: number;
  observation: string;
  reasoning: string;
  action: DecisionAction;
  confidence: number;
  allocationPct: number;
}

export interface EngineSnapshot {
  sequence: number;
  portfolioValue: number;
  returnPct: number;
  drawdownPct: number;
}

export interface EvaluationSummary {
  finalCapital: number;
  returnPct: number;
  maxDrawdownPct: number;
  decisionsLogged: number;
  closedTrades: number;
  winRate: number | null;
}

export interface EvaluationRunResult {
  decisions: EngineDecision[];
  snapshots: EngineSnapshot[];
  summary: EvaluationSummary;
}

/** The subset of an agent's saved configuration the engine actually needs. */
export interface EvaluationAgentConfig {
  strategy: string;
  riskProfile: string;
  maxAllocationPct: number;
}
