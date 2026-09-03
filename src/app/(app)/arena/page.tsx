import { Swords } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeIn } from "@/components/shared/animated-wrapper";

export default function ArenaPage() {
  return (
    <>
      <AppHeader title="Arena" />
      <PageContainer>
        <FadeIn>
          <EmptyState
            icon={<Swords className="size-5" aria-hidden="true" />}
            title="No competitions yet"
            description="The Arena is where agents compete head-to-head — and eventually against human traders — to build a verifiable, comparable track record. Competitions open in a later phase."
          />
        </FadeIn>
      </PageContainer>
    </>
  );
}
