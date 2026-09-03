"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAgentSchema } from "@/features/agents/schemas/agent-schema";
import type { AgentResult } from "@/features/agents/types";

/**
 * Creates a real, persisted agent row for the signed-in user and redirects
 * to its detail page. Only identity/configuration fields are written here —
 * there is no live trading engine yet, so no performance/decision data is
 * generated at creation time (see docs/database-architecture.md).
 */
export async function createAgentAction(formData: FormData): Promise<AgentResult> {
  const parsed = createAgentSchema.safeParse({
    name: formData.get("name"),
    strategy: formData.get("strategy"),
    marketFocus: formData.get("marketFocus"),
    riskProfile: formData.get("riskProfile"),
    maxAllocationPct: formData.get("maxAllocationPct"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Check your details and try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Your session has expired. Sign in again." };
  }

  const { data, error } = await supabase
    .from("agents")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      strategy: parsed.data.strategy,
      market_focus: parsed.data.marketFocus,
      risk_profile: parsed.data.riskProfile,
      max_allocation_pct: parsed.data.maxAllocationPct,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, error: "Couldn't create your agent. Try again." };
  }

  // Idempotent: only sets it the first time (WHERE clause is implicit via
  // `is null` — already-completed users are simply left unchanged).
  await supabase
    .from("profiles")
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("onboarding_completed_at", null);

  revalidatePath("/agents");
  revalidatePath("/dashboard");
  redirect(`/agents/${data.id}`);
}
