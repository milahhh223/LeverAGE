"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#platform", label: "Platform" },
  { href: "/#loop", label: "Journey" },
  { href: "/#arena", label: "Arena" },
] as const;

export function Nav() {
  const [condensed, setCondensed] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCondensed(latest > 24);
  });

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-base",
        condensed
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-marketing items-center justify-between px-6 transition-[height] duration-base",
          condensed ? "h-14" : "h-16"
        )}
      >
        <Logo />
        <nav className="hidden items-center gap-8 text-body-sm text-foreground-muted md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-body-sm text-foreground-muted transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Link href="/sign-up" className={buttonVariants("primary", "sm")}>
            Enter LeverAGE
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
