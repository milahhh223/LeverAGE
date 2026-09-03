"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * LeverAGE motion system.
 *
 * Three distinct motion roles, tuned differently on purpose — using one
 * easing/duration everywhere is what made the previous pass feel
 * mechanical rather than cinematic:
 *
 *  - ENTER_EASE / content reveals (this file's Reveal/FadeIn/MaskedReveal):
 *    a long, gentle deceleration. Content should feel like it settles
 *    into place, not that it was placed there instantly.
 *
 *  - SYSTEM_EASE / living system elements (signal paths, charts, the
 *    intelligence core — used directly in the components that render
 *    them, e.g. hero-visual.tsx, intelligence-loop-section.tsx): slow,
 *    continuous, sine-like. Never a sudden start or stop.
 *
 *  - HOVER_EASE / microinteractions (buttons, nav links — used directly
 *    via Tailwind's duration-fast/base and this curve where a component
 *    needs a custom transition): quick but soft, never abrupt or bouncy.
 */

export const ENTER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const SYSTEM_EASE: [number, number, number, number] = [0.45, 0, 0.55, 1];
export const HOVER_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: ENTER_EASE } },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ duration: 0.9, ease: ENTER_EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainerVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeInVariants} className={className}>
      {children}
    </motion.div>
  );
}

/** Wraps route content so future phases can add page-transition choreography in one place. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: ENTER_EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------------
   Scroll-triggered + directional + masked reveals. These animate once,
   on entering the viewport, rather than on mount — and are tuned slow
   and weighted per the motion system above, not snappy UI defaults.
--------------------------------------------------------------------- */

const VIEWPORT = { once: true, margin: "-100px" } as const;

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

const directionOffset: Record<RevealDirection, { x?: number; y?: number }> = {
  up: { y: 36 },
  down: { y: -36 },
  left: { x: 36 },
  right: { x: -36 },
  none: {},
};

/** Fades and slides an element in the given direction as it enters the viewport. */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.9,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
}) {
  const offset = directionOffset[direction];
  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, ease: ENTER_EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Staggered reveal container — pairs with <RevealItem> children, fires once in view. */
export function RevealGroup({
  children,
  className,
  stagger = 0.16,
  delayChildren = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeInVariants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Masked text reveal: the line clips in from behind an overflow-hidden
 * boundary, rather than simply fading — used sparingly, for the one or
 * two editorial statements per page that should feel like a considered
 * moment rather than routine UI motion.
 *
 * `trigger="viewport"` (default) animates in when scrolled into view —
 * correct for below-the-fold statements (e.g. the final CTA). For
 * content that's visible immediately on page load (a hero headline),
 * pass `trigger="mount"` instead: an element that's already on-screen
 * at mount may never fire a "scrolled into view" event depending on
 * viewport margins and load timing, which left text permanently
 * clipped and invisible — that's the bug this prop exists to prevent.
 */
export function MaskedReveal({
  children,
  className,
  delay = 0,
  trigger = "viewport",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  trigger?: "viewport" | "mount";
}) {
  const motionProps =
    trigger === "mount"
      ? { initial: { y: "112%" }, animate: { y: "0%" } }
      : { initial: { y: "112%" }, whileInView: { y: "0%" }, viewport: VIEWPORT };

  return (
    <span className={cn("block overflow-hidden", className)}>
      <motion.span className="block" {...motionProps} transition={{ duration: 1, ease: ENTER_EASE, delay }}>
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Subtle multi-speed parallax — pass a small pixel range. Respects
 * prefers-reduced-motion by returning a static (non-transformed) element.
 */
export function Parallax({
  children,
  className,
  range = 24,
}: {
  children: React.ReactNode;
  className?: string;
  range?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={ref} className={className}>
      <motion.div style={prefersReducedMotion ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
