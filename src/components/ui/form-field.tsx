import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps a single form control with its label and validation/hint message.
 * The error message is linked via aria-describedby on the control itself —
 * pass `id={htmlFor}` and `aria-describedby` to the child input manually,
 * or use this alongside react-hook-form's register().
 */
export function FormField({ label, htmlFor, error, hint, children, className }: FormFieldProps) {
  const describedBy = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;

  return (
    <div className={cn("mb-4", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
            id: htmlFor,
            "aria-describedby": describedBy,
            "aria-invalid": Boolean(error) || undefined,
          })
        : children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-body-sm text-negative">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-body-sm text-foreground-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
