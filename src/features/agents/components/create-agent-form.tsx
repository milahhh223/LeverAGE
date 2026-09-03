"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAgentSchema, type CreateAgentInput } from "@/features/agents/schemas/agent-schema";
import { createAgentAction } from "@/features/agents/services/agent-actions";
import { AGENT_STRATEGIES, AGENT_MARKET_FOCUSES, AGENT_RISK_PROFILES } from "@/features/agents/constants";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function CreateAgentForm() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAgentInput>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      strategy: AGENT_STRATEGIES[0].value,
      marketFocus: AGENT_MARKET_FOCUSES[0].value,
      riskProfile: "balanced",
      maxAllocationPct: 25,
    },
  });

  async function onSubmit(values: CreateAgentInput) {
    setServerError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("strategy", values.strategy);
    formData.set("marketFocus", values.marketFocus);
    formData.set("riskProfile", values.riskProfile);
    formData.set("maxAllocationPct", String(values.maxAllocationPct));

    // On success this redirects server-side and never returns here.
    const result = await createAgentAction(formData);
    if (!result.success) {
      setServerError(result.error ?? "Couldn't create your agent. Try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-lg">
      <FormField label="Agent name" htmlFor="name" error={errors.name?.message} hint="You can rename it later.">
        <Input placeholder="e.g. Alpha-01" invalid={Boolean(errors.name)} {...register("name")} />
      </FormField>

      <FormField label="Strategy" htmlFor="strategy" error={errors.strategy?.message}>
        <Select options={AGENT_STRATEGIES} invalid={Boolean(errors.strategy)} {...register("strategy")} />
      </FormField>

      <FormField label="Market focus" htmlFor="marketFocus" error={errors.marketFocus?.message}>
        <Select options={AGENT_MARKET_FOCUSES} invalid={Boolean(errors.marketFocus)} {...register("marketFocus")} />
      </FormField>

      <FormField label="Risk profile" htmlFor="riskProfile" error={errors.riskProfile?.message}>
        <Select options={AGENT_RISK_PROFILES} invalid={Boolean(errors.riskProfile)} {...register("riskProfile")} />
      </FormField>

      <FormField
        label="Max allocation per position"
        htmlFor="maxAllocationPct"
        error={errors.maxAllocationPct?.message}
        hint="Share of simulated capital this agent may commit to a single position, as a percentage."
      >
        <Input
          type="number"
          min={1}
          max={100}
          invalid={Boolean(errors.maxAllocationPct)}
          {...register("maxAllocationPct")}
        />
      </FormField>

      {serverError && (
        <p role="alert" className="mb-4 rounded-md bg-negative-muted px-3 py-2 text-body-sm text-negative">
          {serverError}
        </p>
      )}

      <Button type="submit" loading={isSubmitting}>
        Create agent
      </Button>
    </form>
  );
}
