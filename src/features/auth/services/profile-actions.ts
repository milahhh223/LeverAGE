"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/features/auth/schemas/profile-schema";
import type { AuthResult } from "@/features/auth/types";

export async function updateProfileAction(formData: FormData): Promise<AuthResult> {
  const parsed = updateProfileSchema.safeParse({
    displayName: formData.get("displayName"),
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

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: parsed.data.displayName })
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: "Couldn't save your changes. Try again." };
  }

  revalidatePath("/settings");
  return { success: true };
}
