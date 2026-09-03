import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, MaskedReveal } from "@/components/shared/animated-wrapper";
import { Field } from "@/components/marketing/field";
import { buttonVariants } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-border px-6 py-28 text-center">
      <Field tone="active" y="50%" />
      <div className="mx-auto max-w-xl">
        <Reveal>
          <p className="mb-5 font-mono text-caption uppercase tracking-[0.2em] text-primary">
            Build it. Test it. Prove it.
          </p>
        </Reveal>
        <h2 className="text-display-lg font-display text-foreground">
          <MaskedReveal>Don&apos;t just build</MaskedReveal>
          <MaskedReveal delay={0.08}>an agent.</MaskedReveal>
        </h2>
        <Reveal delay={0.2} className="mt-8">
          <Link href="/sign-up" className={buttonVariants("primary", "lg")}>
            Enter LeverAGE
            <ArrowRight className="ml-1 size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
