"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "@/features/auth/schemas/auth-schemas";
import { signUpAction } from "@/features/auth/services/auth-actions";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignUpForm() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) });

  async function onSubmit(values: SignUpInput) {
    setServerError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    if (values.displayName) formData.set("displayName", values.displayName);
    formData.set("email", values.email);
    formData.set("password", values.password);

    const result = await signUpAction(formData);
    if (!result.success) {
      setServerError(result.error ?? "Something went wrong. Try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="Display name" htmlFor="displayName" error={errors.displayName?.message} hint="Optional">
        <Input autoComplete="nickname" invalid={Boolean(errors.displayName)} {...register("displayName")} />
      </FormField>
      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input type="email" autoComplete="email" invalid={Boolean(errors.email)} {...register("email")} />
      </FormField>
      <FormField
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
        hint={errors.password ? undefined : "At least 8 characters, with a number and an uppercase letter."}
      >
        <Input
          type="password"
          autoComplete="new-password"
          invalid={Boolean(errors.password)}
          {...register("password")}
        />
      </FormField>

      {serverError && (
        <p role="alert" className="mb-4 rounded-md bg-negative-muted px-3 py-2 text-body-sm text-negative">
          {serverError}
        </p>
      )}

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Create account
      </Button>
    </form>
  );
}
