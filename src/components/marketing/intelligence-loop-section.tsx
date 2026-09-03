"use client";

import { motion } from "framer-motion";
import { Eye, Brain, GitBranch, ShieldAlert, Gauge } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/animated-wrapper";
import { Field } from "@/components/marketing/field";

const STAGES = [
  { icon: Eye, label: "Observe", detail: "Ingest live market signals as they occur." },
  { icon: Brain, label: "Reason", detail: "Weigh signals against the agent's strategy." },
  { icon: GitBranch, label: "Decide", detail: "Select a pathway among competing actions." },
  { icon: ShieldAlert, label: "Manage risk", detail: "Apply constraints before any action executes." },
  { icon: Gauge, label: "Measure", detail: "Log the outcome into a performance record." },
];

export function IntelligenceLoopSection() {
  return (
    <section id="loop" className="relative border-t border-border px-6 py-24">
      <Field tone="quiet" y="20%" />
      <div className="mx-auto max-w-marketing">
        <Reveal className="mb-14 max-w-lg">
          <p className="mb-4 font-mono text-caption uppercase tracking-[0.2em] text-foreground-subtle">
            How an agent operates
          </p>
          <h2 className="text-heading-xl text-foreground">The intelligence loop</h2>
          <p className="mt-3 text-body-md text-foreground-muted">
            Every cycle moves through the same five stages — a continuous loop, not a one-time decision.
          </p>
        </Reveal>

        <RevealGroup className="relative">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-border-strong md:block" aria-hidden="true" />
          <motion.div
            className="absolute left-0 top-6 hidden h-px origin-left bg-primary md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "100%" }}
          />

          <div className="grid gap-8 md:grid-cols-5 md:gap-4">
            {STAGES.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <RevealItem key={stage.label} className="relative">
                  <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-border-strong bg-surface">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                  </div>
                  <span className="mt-4 block font-mono text-caption text-foreground-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-heading-md text-foreground">{stage.label}</h3>
                  <p className="mt-1.5 text-body-sm text-foreground-muted">{stage.detail}</p>
                </RevealItem>
              );
            })}
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
