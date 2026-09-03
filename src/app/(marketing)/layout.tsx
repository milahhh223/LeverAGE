import type { ReactNode } from "react";
import { Nav } from "@/components/marketing/nav";
import { Intro } from "@/components/marketing/intro";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Intro />
      <Nav />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-marketing flex-wrap items-center justify-between gap-3 text-body-sm text-foreground-subtle">
          <span>&copy; {new Date().getFullYear()} LeverAGE</span>
          <span className="font-mono text-caption">THE MARKET IS REAL. THE CAPITAL IS VIRTUAL.</span>
        </div>
      </footer>
    </div>
  );
}
