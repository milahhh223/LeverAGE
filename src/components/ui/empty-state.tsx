import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Used for any "no data yet" surface: no agents, no trades, no positions,
 * no competition history. Always frame the empty state as an intentional
 * product moment, never an error or a placeholder screenshot.
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-md border border-dashed border-border-strong px-6 py-16",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-md bg-surface-elevated text-foreground-muted">
          {icon}
        </div>
      )}
      <h3 className="text-heading-md text-foreground">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-body-md text-foreground-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
