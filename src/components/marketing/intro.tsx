"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SESSION_KEY = "leverage:intro-seen";
const LAYERS = ["MARKET LAYER", "INTELLIGENCE LAYER", "SIMULATION SPACE"];

/**
 * A short, one-time-per-session environment intro. Deliberately does NOT
 * claim any backend system is "connecting" or "loading" — the labels
 * describe the conceptual layers of the product, not live processes,
 * since no backend for agents/simulation exists yet. Skips entirely on
 * repeat visits within the same session, and renders nothing (no delay,
 * no flash) when prefers-reduced-motion is set.
 */
export function Intro() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setChecked(true);
      return;
    }
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (!seen) {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }
    setChecked(true);
  }, [prefersReducedMotion]);

  React.useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setVisible(false), 2200);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, [visible]);

  if (!checked) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="leverage-field absolute inset-0" data-tone="active" />

          <motion.div
            className="mb-6 flex items-center gap-2.5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="flex size-7 items-center justify-center rounded-sm bg-primary text-[13px] font-mono font-bold text-white">
              L
            </span>
            <span className="font-display text-heading-lg text-foreground">LeverAGE</span>
          </motion.div>

          <div className="flex flex-col items-center gap-2 font-mono text-caption uppercase tracking-[0.18em] text-foreground-subtle">
            {LAYERS.map((label, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0.35] }}
                transition={{
                  duration: 1.7,
                  ease: "easeInOut",
                  delay: 0.3 + i * 0.5,
                  times: [0, 0.25, 0.75, 1],
                }}
              >
                {label}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="mt-8 h-px w-40 origin-left bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
