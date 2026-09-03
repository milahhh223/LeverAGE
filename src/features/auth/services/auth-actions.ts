"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/features/auth/schemas/auth-schemas";
import { getPostAuthRedirectPath } from "@/features/auth/services/onboarding";
import type { AuthResult } from "@/features/auth/types";

/**
 * Maps raw Supabase Auth error messages to plain, non-leaky copy.
 * Supabase error strings aren't a stable API — match loosely.
 */
function toFriendlyAuthError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) {
    return "That email or password isn't right. Try again.";
  }
  if (normalized.includes("user already registered") || normalized.includes("already been registered")) {
    return "An account with that email already exists. Try signing in instead.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Confirm your email before signing in — check your inbox for the link.";
  }
  if (normalized.includes("rate limit")) {
    return "Too many attempts. Wait a moment and try again.";
  }
  return "Something went wrong. Try again in a moment.";
}

export async function signInAction(formData: FormData): Promise<AuthResult> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Check your details and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { success: false, error: toFriendlyAuthError(error.message) };
  }

  redirect(await getPostAuthRedirectPath(supabase, data.user.id));
}

export async function signUpAction(formData: FormData): Promise<AuthResult> {
  const parsed = signUpSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Check your details and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: parsed.data.displayName ? { display_name: parsed.data.displayName } : undefined,
    },
  });

  if (error) {
    return { success: false, error: toFriendlyAuthError(error.message) };
  }

  // No session yet if email confirmation is required — getPostAuthRedirectPath
  // safely falls back to /dashboard in that case, same as before this change.
  redirect(data.user ? await getPostAuthRedirectPath(supabase, data.user.id) : "/dashboard");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
