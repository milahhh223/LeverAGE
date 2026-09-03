import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Supabase client for use in Server Components, Server Actions, and
 * Route Handlers. Reads/writes the session via Next.js cookies().
 *
 * In a Server Component, cookie writes are a no-op (Next.js disallows
 * mutating cookies during render) — session refresh there is handled by
 * middleware instead. That's expected, not a bug.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component — safe to ignore, middleware
          // refreshes the session cookie on the next request instead.
        }
      },
    },
  });
}
