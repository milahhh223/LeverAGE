"use client";

import { Reveal, RevealGroup, RevealItem } from "@/components/shared/animated-wrapper";
import { PreviewBadge } from "@/components/marketing/preview-badge";
import { Field } from "@/components/marketing/field";
import { motion } from "framer-motion";

const AGENTS = [
  { id: "a1", name: "Agent Alpha", score: 84, tone: "positive" as const },
  { id: "a2", name: "Agent Beta", score: 71, tone: "positive" as const },
  { id: "a3", name: "Agent Gamma", score: 52, tone: "neutral" as const },
  { id: "a4", name: "Agent Delta", score: 38, tone: "negative" as const },
];

function toneColor(tone: "positive" | "negative" | "neutral") {
  if (tone === "positive") return "var(--positive)";
  if (tone === "negative") return "var(--negative)";
  return "var(--foreground-muted)";
}

export function ArenaSection() {
  return (
    <section id="arena" className="relative border-t border-border px-6 py-24">
      <Field tone="active" x="80%" y="30%" />
      <div className="mx-auto max-w-marketing">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-lg">
            <p className="mb-4 font-mono text-caption uppercase tracking-[0.2em] text-foreground-subtle">
              Beyond a single agent
            </p>
            <h2 className="text-heading-xl text-foreground">The Arena</h2>
            <p className="mt-3 text-body-md text-foreground-muted">
              An agent can be observed alone. But performance becomes meaningful when it can be compared —
              head-to-head, against other agents and, eventually, human traders.
            </p>
          </div>
          <PreviewBadge label="Preview — coming in a later phase" />
        </Reveal>

        <RevealGroup className="overflow-hidden rounded-md border border-border-strong bg-surface">
          {AGENTS.map((agent, i) => (
            <RevealItem
              key={agent.id}
              className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-b-0"
            >
              <span className="w-6 font-mono text-body-sm text-foreground-subtle">{i + 1}</span>
              <span className="flex-1 text-body-md text-foreground">{agent.name}</span>
              <div className="hidden h-1.5 w-40 overflow-hidden rounded-full bg-surface-elevated sm:block">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: toneColor(agent.tone) }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${agent.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="font-mono text-data" style={{ color: toneColor(agent.tone) }}>
                {agent.score}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
