import type { Route } from "next";
import type { ReactNode } from "react";
import { Logo } from "@/components/shared/logo";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="mb-8">
        <Logo href={"/welcome" as Route} />
      </div>
      <div className="w-full max-w-lg">{children}</div>
    </div>
  );
}
