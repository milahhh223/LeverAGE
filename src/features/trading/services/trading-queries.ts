import { createClient } from "@/lib/supabase/server";
import type { EvaluationRow } from "@/types/database";
import type { TradingSessionDetail, ComparableAgentEvaluation } from "@/features/trading/types";

export async function getTradingSessions(userId: string): Promise<EvaluationRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("evaluations")
    .select("*")
    .eq("user_id", userId)
    .eq("mode", "human")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getTradingSessionDetail(id: string, userId: string): Promise<TradingSessionDetail | null> {
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("evaluations")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .eq("mode", "human")
    .maybeSingle();

  if (!session) return null;

  const [{ data: decisions }, { data: snapshots }] = await Promise.all([
    supabase.from("evaluation_decisions").select("*").eq("evaluation_id", id).order("sequence", { ascending: true }),
    supabase.from("evaluation_snapshots").select("*").eq("evaluation_id", id).order("sequence", { ascending: true }),
  ]);

  return { session, decisions: decisions ?? [], snapshots: snapshots ?? [] };
}

/**
 * The user's completed agent evaluations, one per agent (most recent),
 * for the "compare with an agent" picker on a completed trading session.
 */
export async function getComparableAgentEvaluations(userId: string): Promise<ComparableAgentEvaluation[]> {
  const supabase = await createClient();

  const { data: evaluations } = await supabase
    .from("evaluations")
    .select("id, agent_id, current_capital, starting_capital, created_at")
    .eq("user_id", userId)
    .eq("mode", "agent")
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  if (!evaluations || evaluations.length === 0) return [];

  const seenAgentIds = new Set<string>();
  const latestPerAgent = evaluations.filter((row) => {
    if (!row.agent_id || seenAgentIds.has(row.agent_id)) return false;
    seenAgentIds.add(row.agent_id);
    return true;
  });

  const agentIds = latestPerAgent.map((row) => row.agent_id as string);
  const { data: agents } = await supabase.from("agents").select("id, name").in("id", agentIds);
  const nameByAgentId = new Map((agents ?? []).map((a) => [a.id, a.name]));

  const results: ComparableAgentEvaluation[] = [];
  for (const row of latestPerAgent) {
    const { data: snapshots } = await supabase
      .from("evaluation_snapshots")
      .select("sequence, portfolio_value, drawdown_pct")
      .eq("evaluation_id", row.id)
      .order("sequence", { ascending: true });

    const maxDrawdownPct = Math.max(0, ...(snapshots ?? []).map((s) => s.drawdown_pct));
    const returnPct =
      row.starting_capital > 0 ? ((row.current_capital - row.starting_capital) / row.starting_capital) * 100 : 0;

    results.push({
      evaluationId: row.id,
      agentId: row.agent_id as string,
      agentName: nameByAgentId.get(row.agent_id as string) ?? "Agent",
      returnPct,
      maxDrawdownPct,
      winRate: null, // win rate needs the same snapshot-delta method as the agent detail page; omitted here for brevity
      snapshots: (snapshots ?? []).map((s) => ({ sequence: s.sequence, portfolioValue: s.portfolio_value })),
    });
  }

  return results;
}
