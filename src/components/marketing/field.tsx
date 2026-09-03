import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  tone?: "quiet" | "default" | "active";
  /** Horizontal position of the atmospheric glow, e.g. "50%", "20%". */
  x?: string;
  /** Vertical position of the atmospheric glow, e.g. "-10%", "40%". */
  y?: string;
  noise?: boolean;
  className?: string;
}

/** CSS custom properties aren't part of the standard CSSProperties type — this widens it safely for the two variables Field sets. */
interface FieldStyle extends CSSProperties {
  "--field-x"?: string;
  "--field-y"?: string;
}

/**
 * The shared LeverAGE environment: near-black base, faint technical grid,
 * radial green illumination positioned per-section, optional grain.
 * Sections vary tone/position, not the underlying system — this is what
 * keeps the homepage feeling like one connected world rather than
 * disconnected section backgrounds.
 */
export function Field({ tone = "default", x = "50%", y = "-10%", noise = false, className }: FieldProps) {
  const style: FieldStyle = { "--field-x": x, "--field-y": y };

  return (
    <div
      aria-hidden="true"
      className={cn("leverage-field absolute inset-0 -z-10", className)}
      data-tone={tone}
      style={style}
    >
      {noise && <div className="leverage-noise" />}
    </div>
  );
}
