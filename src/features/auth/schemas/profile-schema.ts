import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(40, "Display name must be under 40 characters"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
