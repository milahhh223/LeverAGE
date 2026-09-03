import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "success";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Icon rendered before the label. Hidden from screen readers automatically. */
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-hover/90",
  secondary:
    "bg-surface-elevated text-foreground border border-border-strong hover:bg-surface-elevated/70 active:bg-surface",
  ghost: "bg-transparent text-foreground-muted hover:bg-surface hover:text-foreground",
  destructive: "bg-negative text-white hover:bg-negative/90 active:bg-negative/80",
  success: "bg-positive text-black hover:bg-positive/90 active:bg-positive/80",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-body-sm gap-1.5",
  md: "h-10 px-4 text-body-md gap-2",
  lg: "h-12 px-6 text-body-lg gap-2.5",
};

/**
 * Returns the same classes <Button> renders with, for cases that must be
 * an <a>/<Link> rather than a <button> (e.g. a primary CTA that navigates).
 * Keeps every "button-shaped" element on one visual source of truth.
 */
export function buttonVariants(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  return cn(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-fast",
    variantStyles[variant],
    sizeStyles[size]
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, icon, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-fast",
          "disabled:opacity-40 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          icon && (
            <span className="shrink-0" aria-hidden="true">
              {icon}
            </span>
          )
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
