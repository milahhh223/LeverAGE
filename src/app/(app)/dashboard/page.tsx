import { Bot, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/animated-wrapper";
import { AgentCard } from "@/features/agents/components/agent-card";
import { getLatestEvaluationSummaries } from "@/features/evaluations/services/evaluation-queries";
import type { AgentRow } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: agents }] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("user_id", user?.id ?? "").single(),
    supabase
      .from("agents")
      .select("*")
      .eq("user_id", user?.id ?? "")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const greetingName = profile?.display_name || user?.email?.split("@")[0] || "there";
  const hasAgents = Boolean(agents && agents.length > 0);
  const evaluations =
    hasAgents && user
      ? await getLatestEvaluationSummaries(
          (agents as AgentRow[]).map((a) => a.id),
          user.id
        )
      : new Map();

  return (
    <>
      <AppHeader title="Dashboard" />
      <PageContainer>
        <FadeIn>
          <h2 className="text-heading-xl text-foreground">Welcome to LeverAGE, {greetingName}.</h2>
          <p className="mt-2 max-w-xl text-body-md text-foreground-muted">
            {hasAgents
              ? "Here's where your agents stand. Start an evaluation on any agent to see real, persisted performance."
              : "Your trading intelligence environment is ready. Once you create your first agent, this dashboard will track its configuration and evaluation results."}
          </p>

          {hasAgents ? (
            <>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(agents as AgentRow[]).map((agent) => (
                  <AgentCard key={agent.id} agent={agent} evaluation={evaluations.get(agent.id)} />
                ))}
              </div>
              <div className="mt-6">
                <Link href="/agents" className={buttonVariants("secondary", "md")}>
                  View all agents
                  <ArrowRight className="ml-1 size-4" aria-hidden="true" />
                </Link>
              </div>
            </>
          ) : (
            <EmptyState
              className="mt-10"
              icon={<Bot className="size-5" aria-hidden="true" />}
              title="No agents yet"
              description="Your first agent will observe markets, make simulated decisions, and build a measurable performance history using virtual capital."
              action={
                <Link href="/agents/new" className={buttonVariants("primary", "md")}>
                  Create your first agent
                  <ArrowRight className="ml-1 size-4" aria-hidden="true" />
                </Link>
              }
            />
          )}
        </FadeIn>
      </PageContainer>
    </>
  );
}
