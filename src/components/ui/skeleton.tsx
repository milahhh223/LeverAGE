import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-sm bg-surface-elevated", className)} aria-hidden="true" />;
}

/** A skeleton shaped like a Card, for content areas awaiting data. */
export function CardSkeleton() {
  return (
    <div className="rounded-md border border-border bg-surface p-6">
      <Skeleton className="h-4 w-1/3 mb-3" />
      <Skeleton className="h-3 w-2/3 mb-6" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  );
}
