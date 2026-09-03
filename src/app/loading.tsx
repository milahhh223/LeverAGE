export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div
        className="size-6 animate-spin rounded-full border-2 border-surface-elevated border-t-primary"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
