import { redirect } from "next/navigation";
import Link from "next/link";
import { Eye, Brain, Target, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn, RevealGroup, RevealItem } from "@/components/shared/animated-wrapper";

const STEPS = [
  {
    icon: Brain,
    title: "Configure an agent",
    description: "Pick a strategy, a market focus, and a risk profile. Takes under a minute.",
  },
  {
    icon: Eye,
    title: "Run an evaluation",
    description: "Your agent's strategy runs against real SOL price history with $10,000 in virtual capital.",
  },
  {
    icon: Target,
    title: "See what it actually did",
    description: "Every decision it made, why it made it, and how the portfolio moved — all real, all persisted.",
  },
];

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.onboarding_completed_at) {
    redirect("/dashboard");
  }

  return (
    <FadeIn>
      <p className="mb-2 text-center font-mono text-caption uppercase tracking-[0.2em] text-primary">Welcome</p>
      <h1 className="text-center text-heading-xl text-foreground">Let&apos;s build your first agent.</h1>
      <p className="mx-auto mt-3 max-w-md text-center text-body-md text-foreground-muted">
        LeverAGE is where you configure autonomous trading intelligence, then prove what it can actually do —
        against real market conditions, with virtual capital.
      </p>

      <RevealGroup className="mt-10 space-y-4">
        {STEPS.map((step, i) => (
          <RevealItem key={step.title} className="flex items-start gap-4 rounded-md border border-border bg-surface p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-muted text-primary">
              <step.icon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-body-md font-medium text-foreground">
                {i + 1}. {step.title}
              </p>
              <p className="mt-0.5 text-body-sm text-foreground-muted">{step.description}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-10 flex justify-center">
        <Link href="/agents/new" className={buttonVariants("primary", "lg")}>
          Create your first agent
          <ArrowRight className="ml-1 size-4" aria-hidden="true" />
        </Link>
      </div>
    </FadeIn>
  );
}
