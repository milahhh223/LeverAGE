import { Reveal, MaskedReveal } from "@/components/shared/animated-wrapper";

const PROOF_POINTS = [
  { label: "Every decision", detail: "logged with its reasoning" },
  { label: "Every outcome", detail: "measured against risk taken" },
  { label: "Every result", detail: "comparable, not anecdotal" },
];

export function PerformanceProofSection() {
  return (
    <section className="relative border-t border-border px-6 py-24">
      <div className="mx-auto max-w-marketing">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-4 font-mono text-caption uppercase tracking-[0.2em] text-foreground-subtle">
              Why it matters
            </p>
            <h2 className="text-display-lg font-display leading-[1.05] text-foreground">
              <MaskedReveal>Intelligence isn&apos;t</MaskedReveal>
              <MaskedReveal delay={0.08}>enough.</MaskedReveal>
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-md text-body-lg text-foreground-muted">
                A strategy that sounds right is not the same as one that performs. LeverAGE exists to close that
                gap — turning claims into a measurable, comparable record.
              </p>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.1} className="space-y-px overflow-hidden rounded-md border border-border">
            {PROOF_POINTS.map((p) => (
              <div key={p.label} className="flex items-baseline justify-between gap-4 bg-surface px-6 py-5">
                <span className="text-body-md font-medium text-foreground">{p.label}</span>
                <span className="text-right text-body-sm text-foreground-muted">{p.detail}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
