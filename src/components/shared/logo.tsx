import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: Route }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 font-display text-heading-md text-foreground tracking-tight",
        className
      )}
    >
      <span className="flex size-6 items-center justify-center rounded-sm bg-primary text-white text-[11px] font-mono font-bold">
        L
      </span>
      LeverAGE
    </Link>
  );
}
