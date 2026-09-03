import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AGENT_STRATEGIES, AGENT_RISK_PROFILES, labelForOption } from "@/features/agents/constants";
import type { AgentEvaluationSummary } from "@/features/evaluations/services/evaluation-queries";
import type { AgentRow } from "@/types/database";

/** Renders one of the signed-in user's real, saved agents. No simulated data here. */
export function AgentCard({ agent, evaluation }: { agent: AgentRow; evaluation?: AgentEvaluationSummary }) {
  return (
    <Link href={`/agents/${agent.id}`} className="block">
      <Card className="transition-colors duration-fast hover:border-border-strong">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{agent.name}</CardTitle>
            <CardDescription>{labelForOption(AGENT_STRATEGIES, agent.strategy)}</CardDescription>
          </div>
          <Badge variant="primary">{labelForOption(AGENT_RISK_PROFILES, agent.risk_profile)}</Badge>
        </CardHeader>
        <CardFooter className="justify-between">
          {evaluation && evaluation.status === "completed" && evaluation.returnPct !== null ? (
            <span
              className={
                evaluation.returnPct >= 0 ? "text-body-sm font-medium text-positive" : "text-body-sm font-medium text-negative"
              }
            >
              {evaluation.returnPct >= 0 ? "+" : ""}
              {evaluation.returnPct.toFixed(1)}% · Evaluated
            </span>
          ) : evaluation && evaluation.status === "failed" ? (
            <span className="text-body-sm text-negative">Last evaluation failed</span>
          ) : (
            <span className="text-body-sm text-foreground-subtle">No evaluations yet</span>
          )}
          <ArrowRight className="size-4 text-foreground-muted" aria-hidden="true" />
        </CardFooter>
      </Card>
    </Link>
  );
}
