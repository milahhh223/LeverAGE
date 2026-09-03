"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * A single-purpose modal dialog. No portal library dependency — renders
 * fixed-position and relies on a high z-index, which is sufficient for
 * Phase 1's needs. Traps Escape-to-close and locks body scroll while open.
 */
export function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
  React.useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" aria-hidden="true" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={cn(
          "relative w-full max-w-md rounded-md border border-border-strong bg-surface-elevated p-6 shadow-xl",
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-sm text-foreground-subtle transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
        <h2 id="dialog-title" className="text-heading-md text-foreground pr-6">
          {title}
        </h2>
        {description && <p className="mt-1.5 text-body-sm text-foreground-muted">{description}</p>}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  );
}
