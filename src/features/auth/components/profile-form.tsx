"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, type UpdateProfileInput } from "@/features/auth/schemas/profile-schema";
import { updateProfileAction } from "@/features/auth/services/profile-actions";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileForm({ initialDisplayName }: { initialDisplayName: string }) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { displayName: initialDisplayName },
  });

  async function onSubmit(values: UpdateProfileInput) {
    setServerError(null);
    setSaved(false);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("displayName", values.displayName);

    const result = await updateProfileAction(formData);
    setIsSubmitting(false);

    if (!result.success) {
      setServerError(result.error ?? "Couldn't save your changes.");
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-sm">
      <FormField label="Display name" htmlFor="displayName" error={errors.displayName?.message}>
        <Input invalid={Boolean(errors.displayName)} {...register("displayName")} />
      </FormField>

      {serverError && (
        <p role="alert" className="mb-4 rounded-md bg-negative-muted px-3 py-2 text-body-sm text-negative">
          {serverError}
        </p>
      )}
      {saved && !serverError && (
        <p role="status" className="mb-4 rounded-md bg-positive-muted px-3 py-2 text-body-sm text-positive">
          Saved.
        </p>
      )}

      <Button type="submit" loading={isSubmitting}>
        Save changes
      </Button>
    </form>
  );
}
