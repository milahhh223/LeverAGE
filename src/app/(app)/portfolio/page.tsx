import { Wallet, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/shared/animated-wrapper";
import { StartSessionButton } from "@/features/trading/components/start-session-button";
import { getTradingSessions } from "@/features/trading/services/trading-queries";
import type { EvaluationRow } from "@/types/database";

function sessionReturnPct(session: EvaluationRow): number {
  return session.starting_capital > 0
    ? ((session.current_capital - session.starting_capital) / session.starting_capital) * 100
    : 0;
}

function SessionCard({ session }: { session: EvaluationRow }) {
  const returnPct = sessionReturnPct(session);
  return (
    <Link href={`/portfolio/${session.id}`} className="block">
      <Card className="transition-colors duration-fast hover:border-border-strong">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{new Date(session.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</CardTitle>
            <CardDescription>Human trading session · SOL</CardDescription>
          </div>
          <Badge variant={session.status === "running" ? "warning" : "default"} className="capitalize">
            {session.status}
          </Badge>
        </CardHeader>
        <CardFooter className="justify-between">
          {session.status === "completed" ? (
            <span className={returnPct >= 0 ? "text-body-sm font-medium text-positive" : "text-body-sm font-medium text-negative"}>
              {returnPct >= 0 ? "+" : ""}
              {returnPct.toFixed(1)}%
            </span>
          ) : (
            <span className="text-body-sm text-foreground-subtle">In progress — day {session.current_sequence + 1}</span>
          )}
          <ArrowRight className="size-4 text-foreground-muted" aria-hidden="true" />
        </CardFooter>
      </Card>
    </Link>
  );
}

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sessions = user ? await getTradingSessions(user.id) : [];
  const hasSessions = sessions.length > 0;

  return (
    <>
      <AppHeader title="Portfolio" />
      <PageContainer>
        <FadeIn>
          {hasSessions ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-body-md text-foreground-muted">
                  Trade SOL manually against the same real historical data your agents evaluate against — then
                  compare your results.
                </p>
                <StartSessionButton />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={<Wallet className="size-5" aria-hidden="true" />}
              title="No trading sessions yet"
              description="Trade SOL manually, day by day, against the same real historical data your agents evaluate against — then compare your results to theirs."
              action={<StartSessionButton />}
            />
          )}
        </FadeIn>
      </PageContainer>
    </>
  );
}
