import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { FadeIn } from "@/components/shared/animated-wrapper";
import { CreateAgentForm } from "@/features/agents/components/create-agent-form";

export default function NewAgentPage() {
  return (
    <>
      <AppHeader title="Create agent" />
      <PageContainer>
        <FadeIn>
          <p className="mb-8 max-w-lg text-body-md text-foreground-muted">
            Configure how this agent observes markets and manages risk. It starts with virtual capital — no real
            funds are ever involved.
          </p>
          <CreateAgentForm />
        </FadeIn>
      </PageContainer>
    </>
  );
}
