import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Marks the field as invalid and switches the border to the negative color. */
  invalid?: boolean;
  options: readonly SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid = false, options, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          aria-invalid={invalid || undefined}
          className={cn(
            "h-10 w-full appearance-none rounded-md bg-surface border px-3 pr-9 text-body-md text-foreground",
            "transition-colors duration-fast",
            "focus:outline-none focus-visible:border-primary",
            invalid ? "border-negative" : "border-border-strong",
            "disabled:opacity-40 disabled:pointer-events-none",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-foreground-subtle"
          aria-hidden="true"
        />
      </div>
    );
  }
);
Select.displayName = "Select";
