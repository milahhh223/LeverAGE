import { Wallet } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeIn } from "@/components/shared/animated-wrapper";

export default function PortfolioPage() {
  return (
    <>
      <AppHeader title="Portfolio" />
      <PageContainer>
        <FadeIn>
          <EmptyState
            icon={<Wallet className="size-5" aria-hidden="true" />}
            title="No portfolio activity yet"
            description="Once an agent is running, its virtual positions, allocations, and performance over time will appear here."
          />
        </FadeIn>
      </PageContainer>
    </>
  );
}
