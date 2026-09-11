"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/features/auth/schemas/auth-schemas";
import { requestPasswordResetAction } from "@/features/auth/services/auth-actions";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordInput) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.set("email", values.email);
    await requestPasswordResetAction(formData);
    setIsSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-body-md text-foreground-muted">
        If an account exists for that email, we&apos;ve sent a link to reset the password. Check your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input type="email" autoComplete="email" invalid={Boolean(errors.email)} {...register("email")} />
      </FormField>

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Send reset link
      </Button>
    </form>
  );
}
