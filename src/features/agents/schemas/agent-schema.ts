import { z } from "zod";
import { AGENT_STRATEGIES, AGENT_MARKET_FOCUSES, AGENT_RISK_PROFILES } from "@/features/agents/constants";

function enumFromOptions(options: readonly { value: string }[]) {
  const values = options.map((option) => option.value) as [string, ...string[]];
  return z.enum(values);
}

export const createAgentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Agent name must be at least 2 characters")
    .max(40, "Agent name must be under 40 characters"),
  strategy: enumFromOptions(AGENT_STRATEGIES),
  marketFocus: enumFromOptions(AGENT_MARKET_FOCUSES),
  riskProfile: enumFromOptions(AGENT_RISK_PROFILES),
  maxAllocationPct: z.coerce
    .number()
    .int("Must be a whole number")
    .min(1, "Must be at least 1%")
    .max(100, "Cannot exceed 100%"),
});

export type CreateAgentInput = z.infer<typeof createAgentSchema>;
