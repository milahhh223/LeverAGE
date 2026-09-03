"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { runEvaluation } from "@/features/evaluations/engine";
import { getDataset } from "@/features/evaluations/dataset";

export interface StartEvaluationResult {
  success: boolean;
  error?: string;
}

const STARTING_CAPITAL = 10000;

/**
 * Runs one full, synchronous evaluation for an agent: creates the
 * evaluation row, executes the deterministic strategy engine against the
 * controlled sample dataset, persists every decision and snapshot, then
 * marks the evaluation completed (or failed, if something breaks partway
 * through — the evaluation row itself is never left silently "running").
 */
export async function startEvaluationAction(agentId: string): Promise<StartEvaluationResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Your session has expired. Sign in again." };
  }

  const { data: agent, error: agentError } = await supabase
    .from("agents")
    .select("*")
    .eq("id", agentId)
    .eq("user_id", user.id)
    .single();

  if (agentError || !agent) {
    return { success: false, error: "Agent not found." };
  }

  // Only the SOL sample dataset exists today, regardless of the agent's
  // configured market focus — see docs/database-architecture.md.
  const dataset = getDataset("sol");

  const { data: evaluation, error: insertError } = await supabase
    .from("evaluations")
    .insert({
      agent_id: agent.id,
      user_id: user.id,
      market: "sol",
      dataset_id: dataset.id,
      starting_capital: STARTING_CAPITAL,
      current_capital: STARTING_CAPITAL,
      status: "running",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertError || !evaluation) {
    return { success: false, error: "Couldn't start the evaluation. Try again." };
  }

  try {
    const result = runEvaluation(
      { strategy: agent.strategy, riskProfile: agent.risk_profile, maxAllocationPct: agent.max_allocation_pct },
      dataset.points,
      STARTING_CAPITAL
    );

    const { error: decisionsError } = await supabase.from("evaluation_decisions").insert(
      result.decisions.map((d) => ({
        evaluation_id: evaluation.id,
        agent_id: agent.id,
        user_id: user.id,
        sequence: d.sequence,
        market_price: d.marketPrice,
        observation: d.observation,
        reasoning: d.reasoning,
        action: d.action,
        confidence: d.confidence,
        allocation_pct: d.allocationPct,
      }))
    );
    if (decisionsError) throw decisionsError;

    const { error: snapshotsError } = await supabase.from("evaluation_snapshots").insert(
      result.snapshots.map((s) => ({
        evaluation_id: evaluation.id,
        agent_id: agent.id,
        user_id: user.id,
        sequence: s.sequence,
        portfolio_value: s.portfolioValue,
        return_pct: s.returnPct,
        drawdown_pct: s.drawdownPct,
      }))
    );
    if (snapshotsError) throw snapshotsError;

    const { error: completeError } = await supabase
      .from("evaluations")
      .update({
        status: "completed",
        current_capital: result.summary.finalCapital,
        completed_at: new Date().toISOString(),
      })
      .eq("id", evaluation.id);
    if (completeError) throw completeError;
  } catch {
    await supabase
      .from("evaluations")
      .update({ status: "failed", completed_at: new Date().toISOString() })
      .eq("id", evaluation.id);
    revalidatePath(`/agents/${agent.id}`);
    return { success: false, error: "The evaluation failed partway through. Check the agent page for details." };
  }

  revalidatePath(`/agents/${agent.id}`);
  revalidatePath("/agents");
  revalidatePath("/dashboard");
  return { success: true };
}
