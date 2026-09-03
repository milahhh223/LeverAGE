import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageContainer({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-app px-6 py-8", className)}>{children}</div>;
}
