import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Marks the field as invalid and switches the border to the negative color. */
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-10 w-full rounded-md bg-surface border px-3 text-body-md text-foreground placeholder:text-foreground-subtle",
          "transition-colors duration-fast",
          "focus:outline-none focus-visible:border-primary",
          invalid ? "border-negative" : "border-border-strong",
          "disabled:opacity-40 disabled:pointer-events-none",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
