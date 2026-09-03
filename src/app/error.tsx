"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In a later phase, send this to real error monitoring instead.
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-md bg-negative-muted text-negative">
            <AlertTriangle className="size-6" aria-hidden="true" />
          </div>
          <h1 className="text-heading-xl text-foreground">Something went wrong</h1>
          <p className="mt-2 max-w-sm text-body-md text-foreground-muted">
            An unexpected error occurred. It&apos;s been logged — try again, or come back in a moment.
          </p>
          <Button className="mt-6" onClick={reset}>
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
