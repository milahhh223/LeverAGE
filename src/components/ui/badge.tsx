import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "primary" | "positive" | "negative" | "warning";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-elevated text-foreground-muted border-border-strong",
  primary: "bg-primary-muted text-primary border-transparent",
  positive: "bg-positive-muted text-positive border-transparent",
  negative: "bg-negative-muted text-negative border-transparent",
  warning: "bg-warning-muted text-warning border-transparent",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-caption font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
