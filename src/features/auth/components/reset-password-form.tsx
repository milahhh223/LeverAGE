"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/features/auth/schemas/auth-schemas";
import { updatePasswordAction } from "@/features/auth/services/auth-actions";
import { createClient } from "@/lib/supabase/client";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";

type LinkStatus = "checking" | "valid" | "invalid";

export function ResetPasswordForm() {
  const [linkStatus, setLinkStatus] = React.useState<LinkStatus>("checking");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  React.useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setLinkStatus("valid");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setLinkStatus("valid");
    });

    const timeout = setTimeout(() => {
      setLinkStatus((current) => (current === "checking" ? "invalid" : current));
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function onSubmit(values: ResetPasswordInput) {
    setServerError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("password", values.password);

    const result = await updatePasswordAction(formData);
    if (!result.success) {
      setServerError(result.error ?? "Something went wrong. Try again.");
      setIsSubmitting(false);
    }
  }

  if (linkStatus === "checking") {
    return <p className="text-body-md text-foreground-muted">Checking your reset link…</p>;
  }

  if (linkStatus === "invalid") {
    return (
      <p className="text-body-md text-foreground-muted">
        This reset link is invalid or has expired.{" "}
        <Link href="/forgot-password" className="text-primary hover:text-primary-hover">
          Request a new one
        </Link>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField
        label="New password"
        htmlFor="password"
        error={errors.password?.message}
        hint={errors.password ? undefined : "At least 8 characters, with a number and an uppercase letter."}
      >
        <PasswordInput autoComplete="new-password" invalid={Boolean(errors.password)} {...register("password")} />
      </FormField>

      {serverError && (
        <p role="alert" className="mb-4 rounded-md bg-negative-muted px-3 py-2 text-body-sm text-negative">
          {serverError}
        </p>
      )}

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Update password
      </Button>
    </form>
  );
}
