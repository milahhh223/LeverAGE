"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDataset, getDatasetById } from "@/features/evaluations/dataset";
import { computeSnapshot, unrealizedPnl, type OpenPosition } from "@/features/evaluations/portfolio-math";
import type { TradeAction } from "@/features/trading/types";

export interface TradingActionResult {
  success: boolean;
  error?: string;
}

const STARTING_CAPITAL = 10000;

export async function startTradingSessionAction(): Promise<TradingActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Your session has expired. Sign in again." };
  }

  const dataset = getDataset("sol");

  const { data, error } = await supabase
    .from("evaluations")
    .insert({
      user_id: user.id,
      agent_id: null,
      mode: "human",
      market: "sol",
      dataset_id: dataset.id,
      starting_capital: STARTING_CAPITAL,
      current_capital: STARTING_CAPITAL,
      peak_value: STARTING_CAPITAL,
      status: "running",
      current_sequence: 0,
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, error: "Couldn't start a trading session. Try again." };
  }

  revalidatePath("/portfolio");
  redirect(`/portfolio/${data.id}`);
}

/** Realizes an open position at the given price. Shared by submitTradeAction and endSessionAction. */
function closePosition(position: OpenPosition, capital: number, price: number) {
  return capital + unrealizedPnl(position, price);
}

export async function submitTradeAction(evaluationId: string, formData: FormData): Promise<TradingActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Your session has expired. Sign in again." };
  }

  const { data: session, error: sessionError } = await supabase
    .from("evaluations")
    .select("*")
    .eq("id", evaluationId)
    .eq("user_id", user.id)
    .eq("mode", "human")
    .single();

  if (sessionError || !session || session.status !== "running") {
    return { success: false, error: "This session isn't available." };
  }

  const dataset = getDatasetById(session.dataset_id) ?? getDataset("sol");
  const lastIndex = dataset.points.length - 1;
  const point = dataset.points[session.current_sequence];

  if (!point) {
    return { success: false, error: "This session has no more days to trade." };
  }

  const price = point.price;
  const hasPosition = session.position_side !== null;
  const isLastStep = session.current_sequence === lastIndex;

  let action = (formData.get("action") as TradeAction | null) ?? "HOLD";
  const rawAllocation = Number(formData.get("allocationPct"));
  const rawConfidence = Number(formData.get("confidencePct"));
  const reasoningInput = (formData.get("reasoning") as string | null)?.trim();

  const allowedActions: TradeAction[] = hasPosition ? ["HOLD", "EXIT"] : ["LONG", "SHORT", "HOLD"];
  if (!allowedActions.includes(action)) {
    return { success: false, error: "That action isn't available right now." };
  }
  if (isLastStep && !hasPosition && action !== "HOLD") {
    return { success: false, error: "This is the final day — there's no day left to exit a new position on." };
  }
  if (isLastStep && hasPosition) {
    action = "EXIT"; // the session must end fully realized, same as an agent evaluation
  }

  const confidencePct = Number.isFinite(rawConfidence) ? Math.min(100, Math.max(0, rawConfidence)) : 70;

  let newCapital = session.current_capital;
  let newPosition: OpenPosition | null = hasPosition
    ? {
        side: session.position_side as "LONG" | "SHORT",
        entryPrice: session.position_entry_price!,
        allocationPct: session.position_allocation_pct!,
        allocationValue: session.position_allocation_value!,
      }
    : null;
  let observation: string;
  let loggedAllocationPct = 0;

  if (action === "EXIT" && newPosition) {
    newCapital = closePosition(newPosition, session.current_capital, price);
    observation = `Position closed at $${price.toFixed(2)}, entered at $${newPosition.entryPrice.toFixed(2)}.`;
    loggedAllocationPct = newPosition.allocationPct;
    newPosition = null;
  } else if (action === "LONG" || action === "SHORT") {
    const allocationPct = Number.isFinite(rawAllocation) ? Math.min(100, Math.max(1, Math.round(rawAllocation))) : 25;
    const allocationValue = session.starting_capital * (allocationPct / 100);
    newPosition = { side: action, entryPrice: price, allocationPct, allocationValue };
    observation = `Opened ${action} at $${price.toFixed(2)} with ${allocationPct}% allocation.`;
    loggedAllocationPct = allocationPct;
  } else {
    observation = newPosition
      ? `Holding the open ${newPosition.side} position at $${price.toFixed(2)}.`
      : `Stayed flat at $${price.toFixed(2)}.`;
    loggedAllocationPct = newPosition?.allocationPct ?? 0;
  }

  const snapshot = computeSnapshot({
    capital: newCapital,
    position: newPosition,
    price,
    startingCapital: session.starting_capital,
    peak: session.peak_value,
  });

  const { error: decisionError } = await supabase.from("evaluation_decisions").insert({
    evaluation_id: session.id,
    agent_id: null,
    user_id: user.id,
    sequence: session.current_sequence,
    market_price: price,
    observation,
    reasoning: reasoningInput || observation,
    action,
    confidence: confidencePct / 100,
    allocation_pct: loggedAllocationPct,
  });
  if (decisionError) {
    return { success: false, error: "Couldn't record that trade. Try again." };
  }

  const { error: snapshotError } = await supabase.from("evaluation_snapshots").insert({
    evaluation_id: session.id,
    agent_id: null,
    user_id: user.id,
    sequence: session.current_sequence,
    portfolio_value: snapshot.portfolioValue,
    return_pct: snapshot.returnPct,
    drawdown_pct: snapshot.drawdownPct,
  });
  if (snapshotError) {
    return { success: false, error: "Couldn't record that trade's result. Try again." };
  }

  const nextSequence = session.current_sequence + 1;
  const completed = nextSequence > lastIndex;

  const { error: updateError } = await supabase
    .from("evaluations")
    .update({
      current_capital: newCapital,
      position_side: newPosition?.side ?? null,
      position_entry_price: newPosition?.entryPrice ?? null,
      position_allocation_pct: newPosition?.allocationPct ?? null,
      position_allocation_value: newPosition?.allocationValue ?? null,
      peak_value: snapshot.peak,
      current_sequence: nextSequence,
      status: completed ? "completed" : "running",
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", session.id);

  if (updateError) {
    return { success: false, error: "Couldn't advance the session. Try again." };
  }

  revalidatePath(`/portfolio/${session.id}`);
  revalidatePath("/portfolio");
  return { success: true };
}

export async function endSessionAction(evaluationId: string): Promise<TradingActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Your session has expired. Sign in again." };
  }

  const { data: session, error: sessionError } = await supabase
    .from("evaluations")
    .select("*")
    .eq("id", evaluationId)
    .eq("user_id", user.id)
    .eq("mode", "human")
    .single();

  if (sessionError || !session || session.status !== "running") {
    return { success: false, error: "This session isn't available." };
  }

  const dataset = getDatasetById(session.dataset_id) ?? getDataset("sol");
  const lastSeenIndex = Math.max(0, session.current_sequence - 1);
  const lastSeenPrice = dataset.points[lastSeenIndex]?.price ?? dataset.points[0]!.price;

  let newCapital = session.current_capital;
  let peak = session.peak_value;

  if (session.position_side) {
    const position: OpenPosition = {
      side: session.position_side as "LONG" | "SHORT",
      entryPrice: session.position_entry_price!,
      allocationPct: session.position_allocation_pct!,
      allocationValue: session.position_allocation_value!,
    };
    newCapital = closePosition(position, session.current_capital, lastSeenPrice);

    const snapshot = computeSnapshot({
      capital: newCapital,
      position: null,
      price: lastSeenPrice,
      startingCapital: session.starting_capital,
      peak: session.peak_value,
    });
    peak = snapshot.peak;

    await supabase.from("evaluation_decisions").insert({
      evaluation_id: session.id,
      agent_id: null,
      user_id: user.id,
      sequence: session.current_sequence,
      market_price: lastSeenPrice,
      observation: `Session ended early; position closed at $${lastSeenPrice.toFixed(2)} to realize results.`,
      reasoning: "Ended the session before reaching the final day.",
      action: "EXIT",
      confidence: 0.6,
      allocation_pct: position.allocationPct,
    });

    await supabase.from("evaluation_snapshots").insert({
      evaluation_id: session.id,
      agent_id: null,
      user_id: user.id,
      sequence: session.current_sequence,
      portfolio_value: snapshot.portfolioValue,
      return_pct: snapshot.returnPct,
      drawdown_pct: snapshot.drawdownPct,
    });
  }

  const { error: updateError } = await supabase
    .from("evaluations")
    .update({
      current_capital: newCapital,
      position_side: null,
      position_entry_price: null,
      position_allocation_pct: null,
      position_allocation_value: null,
      peak_value: peak,
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", session.id);

  if (updateError) {
    return { success: false, error: "Couldn't end the session. Try again." };
  }

  revalidatePath(`/portfolio/${session.id}`);
  revalidatePath("/portfolio");
  return { success: true };
}
