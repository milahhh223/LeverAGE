import type { EvaluationRow, EvaluationDecisionRow, EvaluationSnapshotRow } from "@/types/database";

export type TradeAction = "LONG" | "SHORT" | "HOLD" | "EXIT";

export interface TradingSessionDetail {
  session: EvaluationRow;
  decisions: EvaluationDecisionRow[];
  snapshots: EvaluationSnapshotRow[];
}

export interface ComparableAgentEvaluation {
  evaluationId: string;
  agentId: string;
  agentName: string;
  returnPct: number;
  maxDrawdownPct: number;
  winRate: number | null;
  snapshots: { sequence: number; portfolioValue: number }[];
}
