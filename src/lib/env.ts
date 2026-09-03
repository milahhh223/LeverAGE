import { z } from "zod";

/**
 * All environment variables the application depends on, validated once
 * at import time. If a required variable is missing, the app fails
 * immediately with a clear error instead of surfacing a cryptic runtime
 * error later (e.g. "supabaseUrl is required").
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url({ message: "NEXT_PUBLIC_SUPABASE_URL must be a valid URL. Check your .env.local against .env.example." }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, { message: "NEXT_PUBLIC_SUPABASE_ANON_KEY is required. Check your .env.local against .env.example." }),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
  throw new Error(
    `Invalid or missing environment variables:\n${issues}\n\nCopy .env.example to .env.local and fill in your Supabase project values.`
  );
}

export const env = parsed.data;
