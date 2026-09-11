"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInInput } from "@/features/auth/schemas/auth-schemas";
import { signInAction } from "@/features/auth/services/auth-actions";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(values: SignInInput) {
    setServerError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);

    const result = await signInAction(formData);
    if (!result.success) {
      setServerError(result.error ?? "Something went wrong. Try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input type="email" autoComplete="email" invalid={Boolean(errors.email)} {...register("email")} />
      </FormField>
      <FormField label="Password" htmlFor="password" error={errors.password?.message}>
        <PasswordInput autoComplete="current-password" invalid={Boolean(errors.password)} {...register("password")} />
      </FormField>
      <p className="mb-4 -mt-2 text-right">
        <Link href="/forgot-password" className="text-body-sm text-foreground-muted hover:text-foreground">
          Forgot password?
        </Link>
      </p>

      {serverError && (
        <p role="alert" className="mb-4 rounded-md bg-negative-muted px-3 py-2 text-body-sm text-negative">
          {serverError}
        </p>
      )}

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
