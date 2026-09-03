/**
 * DEMO DATA — NOT LIVE DATA.
 *
 * This file is the single source of illustrative data for the homepage's
 * agent-environment preview. No component should hardcode numbers of its
 * own — everything the preview displays comes from here, so that when
 * real agents/simulation exist, only this file's source needs to change
 * (or be replaced by a query) rather than the UI itself.
 *
 * Every consumer of this data must visually mark it as a preview
 * (see the <PreviewBadge> usage in agent-preview-section.tsx).
 */

export interface DemoSignalPoint {
  t: number; // relative time index, not a real timestamp
  value: number; // relative performance index, not currency
}

export interface DemoDecision {
  id: string;
  time: string; // relative label, e.g. "14:02", not a real trade time
  action: "LONG" | "SHORT" | "HOLD" | "EXIT";
  instrument: string;
  reasoning: string;
  confidence: number; // 0-1
}

export interface DemoAgentProfile {
  name: string;
  status: "Preview";
  strategy: string;
  riskProfile: "Conservative" | "Balanced" | "Aggressive";
  performanceSeries: DemoSignalPoint[];
  decisions: DemoDecision[];
  metrics: {
    label: string;
    value: string;
    tone: "positive" | "negative" | "neutral";
  }[];
}

export const demoAgent: DemoAgentProfile = {
  name: "Agent — Preview",
  status: "Preview",
  strategy: "Momentum / mean-reversion hybrid",
  riskProfile: "Balanced",
  performanceSeries: [
    { t: 0, value: 100 },
    { t: 1, value: 103.2 },
    { t: 2, value: 101.8 },
    { t: 3, value: 106.4 },
    { t: 4, value: 109.1 },
    { t: 5, value: 107.6 },
    { t: 6, value: 112.9 },
    { t: 7, value: 116.3 },
    { t: 8, value: 114.7 },
    { t: 9, value: 119.5 },
  ],
  decisions: [
    {
      id: "d1",
      time: "09:31",
      action: "LONG",
      instrument: "Simulated equity index",
      reasoning: "Momentum signal crossed threshold with confirming volume.",
      confidence: 0.78,
    },
    {
      id: "d2",
      time: "11:04",
      action: "HOLD",
      instrument: "Simulated equity index",
      reasoning: "Signal strength within neutral band — no action taken.",
      confidence: 0.55,
    },
    {
      id: "d3",
      time: "13:47",
      action: "EXIT",
      instrument: "Simulated equity index",
      reasoning: "Risk threshold reached; position closed per risk profile.",
      confidence: 0.81,
    },
  ],
  metrics: [
    { label: "Simulated return", value: "+19.5%", tone: "positive" },
    { label: "Max drawdown", value: "-4.2%", tone: "negative" },
    { label: "Decisions logged", value: "142", tone: "neutral" },
    { label: "Win rate", value: "58%", tone: "positive" },
  ],
};
