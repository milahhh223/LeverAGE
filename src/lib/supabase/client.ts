import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Supabase client for use in Client Components ("use client").
 * Safe to call repeatedly — construct once per component via a ref/memo
 * if you need to avoid re-creating it on every render.
 */
export function createClient() {
  return createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
