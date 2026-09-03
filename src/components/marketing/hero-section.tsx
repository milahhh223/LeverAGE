import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { Field } from "@/components/marketing/field";
import { FadeIn, MaskedReveal } from "@/components/shared/animated-wrapper";

export function HeroSection() {
  return (
    <section id="platform" className="relative overflow-hidden px-6 pb-24 pt-16 md:pt-19">
      <Field tone="active" x="72%" y="-5%" noise />

      <div className="mx-auto grid max-w-marketing items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-8">
        <div>
          <FadeIn>
            <p className="mb-6 font-mono text-caption uppercase tracking-[0.2em] text-primary">
              Autonomous market intelligence
            </p>
          </FadeIn>

          {/* The visual sits behind/beside the headline within the same composition rather than
            in a separate column — the intelligence core is deliberately positioned to sit near
            "Prove it." so the two read as one statement, not two placed-together blocks. */}
        <div className="relative">
          <h1 className="relative z-10 max-w-3xl text-display-xl font-display leading-[0.96] text-foreground">
            <MaskedReveal trigger="mount">Don&apos;t just build</MaskedReveal>
            <MaskedReveal trigger="mount" delay={0.1}>an agent.</MaskedReveal>
            <MaskedReveal trigger="mount" delay={0.2} className="text-primary">
              Prove it.
            </MaskedReveal>
          </h1>

        </div>

          <FadeIn delay={0.3}>
            <p className="mt-6 max-w-md text-body-lg text-foreground-muted">
              Build and evaluate autonomous trading intelligence against real market conditions using virtual
              capital. Observe how decisions are made, measure performance, and build a record worth proving.
            </p>
          </FadeIn>

          <FadeIn delay={0.4} className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/sign-up" className={buttonVariants("primary", "lg")}>
              Enter LeverAGE
              <ArrowRight className="ml-1 size-4" aria-hidden="true" />
            </Link>
            <Link href="#loop" className={buttonVariants("ghost", "lg")}>
              Explore the system
              <ChevronRight className="ml-1 size-4" aria-hidden="true" />
            </Link>
          </FadeIn>
        </div>

        <FadeIn delay={0.5} className="flex justify-center md:justify-end">
          <HeroVisual />
        </FadeIn>
      </div>
    </section>
  );
}
