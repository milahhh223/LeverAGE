import { createClient } from "@/lib/supabase/server";
import type { EvaluationRow, EvaluationDecisionRow, EvaluationSnapshotRow } from "@/types/database";

export interface LatestEvaluation {
  evaluation: EvaluationRow;
  decisions: EvaluationDecisionRow[];
  snapshots: EvaluationSnapshotRow[];
}

/** Full detail for one agent's most recent evaluation — used on the agent detail page. */
export async function getLatestEvaluation(agentId: string, userId: string): Promise<LatestEvaluation | null> {
  const supabase = await createClient();

  const { data: evaluation } = await supabase
    .from("evaluations")
    .select("*")
    .eq("agent_id", agentId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!evaluation) return null;

  const [{ data: decisions }, { data: snapshots }] = await Promise.all([
    supabase
      .from("evaluation_decisions")
      .select("*")
      .eq("evaluation_id", evaluation.id)
      .order("sequence", { ascending: true }),
    supabase
      .from("evaluation_snapshots")
      .select("*")
      .eq("evaluation_id", evaluation.id)
      .order("sequence", { ascending: true }),
  ]);

  return { evaluation, decisions: decisions ?? [], snapshots: snapshots ?? [] };
}

export interface AgentEvaluationSummary {
  status: string;
  returnPct: number | null;
}

/** Lightweight per-agent latest-evaluation summary for list views (Agents page, Dashboard). */
export async function getLatestEvaluationSummaries(
  agentIds: string[],
  userId: string
): Promise<Map<string, AgentEvaluationSummary>> {
  const map = new Map<string, AgentEvaluationSummary>();
  if (agentIds.length === 0) return map;

  const supabase = await createClient();
  const { data } = await supabase
    .from("evaluations")
    .select("agent_id, status, current_capital, starting_capital, created_at")
    .in("agent_id", agentIds)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  for (const row of data ?? []) {
    // Rows are ordered newest-first, so the first row seen per agent is its latest evaluation.
    // agent_id is guaranteed non-null here since the query above filters to only rows whose
    // agent_id is in `agentIds` — this guard just satisfies the nullable column type.
    if (!row.agent_id || map.has(row.agent_id)) continue;
    const returnPct =
      row.starting_capital > 0 ? ((row.current_capital - row.starting_capital) / row.starting_capital) * 100 : null;
    map.set(row.agent_id, { status: row.status, returnPct });
  }

  return map;
}
