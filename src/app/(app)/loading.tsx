import { CardSkeleton } from "@/components/ui/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";

export default function AppLoading() {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <Skeleton className="h-5 w-32" />
      </div>
      <PageContainer>
        <Skeleton className="mb-2 h-6 w-64" />
        <Skeleton className="mb-8 h-4 w-96" />
        <CardSkeleton />
      </PageContainer>
    </>
  );
}
