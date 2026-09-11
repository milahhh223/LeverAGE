import Image from "next/image";
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
      <Image src="/logo-mark.png" alt="" width={36} height={36} className="size-9" priority />
      LeverAGE
    </Link>
  );
}
