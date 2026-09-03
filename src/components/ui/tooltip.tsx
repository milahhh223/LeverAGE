"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Tooltip({
  label,
  children,
  side = "top",
}: {
  label: string;
  children: React.ReactElement<Record<string, unknown>>;
  side?: "top" | "bottom";
}) {
  const [visible, setVisible] = React.useState(false);
  const id = React.useId();

  return (
    <span className="relative inline-flex">
      {React.cloneElement(children, {
        "aria-describedby": id,
        onMouseEnter: () => setVisible(true),
        onMouseLeave: () => setVisible(false),
        onFocus: () => setVisible(true),
        onBlur: () => setVisible(false),
      })}
      {visible && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-sm bg-surface-elevated border border-border-strong px-2 py-1 text-caption text-foreground shadow-md",
            side === "top" ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
