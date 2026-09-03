/**
 * Single source of truth for agent configuration options.
 *
 * These values must stay in sync with the check constraints in
 * supabase/migrations/0002_agents.sql — adding an option here without a
 * matching migration will fail at insert time, by design.
 */

export const AGENT_STRATEGIES = [
  { value: "momentum", label: "Momentum" },
  { value: "mean_reversion", label: "Mean reversion" },
  { value: "hybrid", label: "Momentum / mean-reversion hybrid" },
  { value: "trend_following", label: "Trend following" },
] as const;

export type AgentStrategy = (typeof AGENT_STRATEGIES)[number]["value"];

export const AGENT_MARKET_FOCUSES = [
  { value: "sol", label: "SOL" },
  { value: "ansem", label: "$ANSEM" },
  { value: "general", label: "General Solana markets" },
] as const;

export type AgentMarketFocus = (typeof AGENT_MARKET_FOCUSES)[number]["value"];

export const AGENT_RISK_PROFILES = [
  { value: "conservative", label: "Conservative" },
  { value: "balanced", label: "Balanced" },
  { value: "aggressive", label: "Aggressive" },
] as const;

export type AgentRiskProfile = (typeof AGENT_RISK_PROFILES)[number]["value"];

/** Resolves a stored option value (e.g. "mean_reversion") to its display label. */
export function labelForOption(options: readonly { value: string; label: string }[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
