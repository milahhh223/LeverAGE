"use client";

import { motion, useReducedMotion } from "framer-motion";

const SIGNAL_NODES = [
  { id: "sig-1", x: 40, y: 60, delay: 0 },
  { id: "sig-2", x: 40, y: 140, delay: 0.4 },
  { id: "sig-3", x: 40, y: 220, delay: 0.8 },
  { id: "sig-4", x: 40, y: 300, delay: 1.2 },
];

const DECISION_NODES = [
  { id: "dec-1", x: 460, y: 90, label: "LONG", tone: "positive" as const },
  { id: "dec-2", x: 460, y: 180, label: "HOLD", tone: "neutral" as const },
  { id: "dec-3", x: 460, y: 270, label: "EXIT", tone: "negative" as const },
];

const CORE = { x: 250, y: 180 };

function toneColor(tone: "positive" | "negative" | "neutral") {
  if (tone === "positive") return "var(--positive)";
  if (tone === "negative") return "var(--negative)";
  return "var(--foreground-muted)";
}

/**
 * Conceptual composition: market signals (left) converge on a central
 * intelligence core, which branches into weighted decision pathways
 * (right). Every element maps to something real in the product concept —
 * not decoration. Kept as SVG + Framer Motion rather than WebGL: the
 * scene is simple enough that DOM/SVG is materially cheaper and just as
 * expressive here.
 */
export function HeroVisual() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 520 360"
      className="h-auto w-full max-w-[560px]"
      role="img"
      aria-label="Diagram: market signals converging on a central intelligence core, branching into weighted decision pathways"
    >
      <defs>
        <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="signal-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--foreground-subtle)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* signal -> core paths, drawn in on mount */}
      {SIGNAL_NODES.map((n) => (
        <motion.path
          key={`path-${n.id}`}
          d={`M ${n.x} ${n.y} C ${(n.x + CORE.x) / 2} ${n.y}, ${(n.x + CORE.x) / 2} ${CORE.y}, ${CORE.x - 34} ${CORE.y}`}
          fill="none"
          stroke="url(#signal-line)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: n.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}

      {/* core -> decision paths, weighted by stroke */}
      {DECISION_NODES.map((n, i) => (
        <path
          key={`path-${n.id}`}
          d={`M ${CORE.x + 34} ${CORE.y} C ${(CORE.x + n.x) / 2} ${CORE.y}, ${(CORE.x + n.x) / 2} ${n.y}, ${n.x - 8} ${n.y}`}
          fill="none"
          stroke={toneColor(n.tone)}
          strokeOpacity={i === 0 ? 0.75 : 0.35}
          strokeWidth={i === 0 ? 1.5 : 1}
        />
      ))}

      {/* pulsing opacity on signal source nodes — reads as "signal arriving" without offset-path fragility */}
      {SIGNAL_NODES.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="4" fill="var(--surface-elevated)" stroke="var(--border-strong)" />
          <motion.circle
            cx={n.x}
            cy={n.y}
            r="4"
            fill="none"
            stroke="var(--primary)"
            strokeOpacity="0.6"
            animate={prefersReducedMotion ? undefined : { r: [4, 9, 4], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: n.delay, ease: "easeOut" }}
          />
        </g>
      ))}

      {/* intelligence core */}
      <circle cx={CORE.x} cy={CORE.y} r="70" fill="url(#core-glow)" />
      <motion.circle
        cx={CORE.x}
        cy={CORE.y}
        r="30"
        fill="var(--surface)"
        stroke="var(--primary)"
        strokeWidth="1.5"
        animate={prefersReducedMotion ? undefined : { r: [30, 32, 30] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx={CORE.x} cy={CORE.y} r="4" fill="var(--primary)" />

      {/* decision nodes */}
      {DECISION_NODES.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x - 4}
            y={n.y - 14}
            width="60"
            height="28"
            rx="6"
            fill="var(--surface)"
            stroke={toneColor(n.tone)}
            strokeOpacity={n.tone === "neutral" ? 0.3 : 0.6}
          />
          <text
            x={n.x + 26}
            y={n.y + 4}
            textAnchor="middle"
            fontSize="10"
            fontFamily="var(--font-mono)"
            fill={toneColor(n.tone)}
            letterSpacing="0.5"
          >
            {n.label}
          </text>
        </g>
      ))}

      <text x={CORE.x} y={CORE.y + 52} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--foreground-subtle)" letterSpacing="1.5">
        INTELLIGENCE CORE
      </text>
    </svg>
  );
}
