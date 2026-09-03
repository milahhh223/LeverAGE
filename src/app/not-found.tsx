import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-md bg-surface-elevated text-foreground-muted">
        <Compass className="size-6" aria-hidden="true" />
      </div>
      <p className="font-mono text-caption text-foreground-subtle">404</p>
      <h1 className="mt-1 text-heading-xl text-foreground">Page not found</h1>
      <p className="mt-2 max-w-sm text-body-md text-foreground-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className={`${buttonVariants("primary", "md")} mt-6`}>
        Back to home
      </Link>
    </div>
  );
}
