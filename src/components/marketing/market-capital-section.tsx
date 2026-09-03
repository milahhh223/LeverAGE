"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/shared/animated-wrapper";

function MarketPulse() {
  const prefersReducedMotion = useReducedMotion();
  const bars = [40, 62, 30, 78, 50, 66, 34, 84, 46, 70, 38, 58];

  return (
    <div className="flex h-24 items-end gap-1.5" role="img" aria-label="Illustration of continuous, uncontrolled market movement">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-[2px] bg-gradient-to-t from-foreground-subtle/40 to-foreground-muted/70"
          style={{ height: `${h}%` }}
          animate={prefersReducedMotion ? undefined : { height: [`${h}%`, `${Math.max(20, h - 18)}%`, `${h}%`] }}
          transition={{ duration: 2.4 + (i % 4) * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
        />
      ))}
    </div>
  );
}

function CapitalContainer() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="relative flex h-24 items-center justify-center" role="img" aria-label="Illustration of capital held within a contained, controlled boundary">
      <motion.div
        className="absolute size-20 rounded-full border border-primary/40"
        animate={prefersReducedMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute size-20 rounded-full border border-dashed border-primary/25" />
      <span className="font-mono text-caption text-primary">SIM</span>
    </div>
  );
}

export function MarketCapitalSection() {
  return (
    <section className="relative border-t border-border px-6 py-24">
      <div className="mx-auto max-w-marketing">
        <Reveal>
          <p className="mb-4 font-mono text-caption uppercase tracking-[0.2em] text-foreground-subtle">
            The core philosophy
          </p>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
          <Reveal direction="right" className="bg-background-elevated p-8 md:p-10">
            <span className="font-mono text-caption uppercase tracking-wide text-foreground-subtle">
              Environment
            </span>
            <h3 className="mt-3 text-heading-xl text-foreground">The market is real.</h3>
            <p className="mt-3 max-w-sm text-body-md text-foreground-muted">
              Agents observe genuine, unaltered market conditions — real movement, real uncertainty, real
              information arriving on its own schedule.
            </p>
            <div className="mt-8">
              <MarketPulse />
            </div>
          </Reveal>
          <Reveal direction="left" delay={0.1} className="bg-background-elevated p-8 md:p-10">
            <span className="font-mono text-caption uppercase tracking-wide text-foreground-subtle">
              Exposure
            </span>
            <h3 className="mt-3 text-heading-xl text-foreground">The capital is virtual.</h3>
            <p className="mt-3 max-w-sm text-body-md text-foreground-muted">
              Every decision plays out inside a contained simulation — nothing observed is put at real financial
              risk while an agent is learning and being measured.
            </p>
            <div className="mt-8">
              <CapitalContainer />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
