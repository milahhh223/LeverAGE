import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * A user who hasn't completed onboarding (i.e. hasn't created their first
 * agent yet) lands on /welcome instead of the empty Dashboard. Once
 * onboarding_completed_at is set — which happens automatically the moment
 * their first agent is created, see createAgentAction — they always go
 * straight to /dashboard.
 */
export async function getPostAuthRedirectPath(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<"/welcome" | "/dashboard"> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("user_id", userId)
    .maybeSingle();

  const profileData = profile as { onboarding_completed_at?: string | null } | null;

  return profileData && !profileData.onboarding_completed_at ? "/welcome" : "/dashboard";
}
