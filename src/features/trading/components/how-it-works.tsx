"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "You start with $10,000 in virtual money.", detail: "Nothing real is ever at risk." },
  {
    title: "Each day, you see the real price and decide.",
    detail: "Go Long if you think it'll rise, Short if you think it'll fall, or Hold to wait.",
  },
  {
    title: "Once you're in a trade, you can only Hold or Exit.",
    detail: "You can't open a second position on top of one that's already open — Exit the first one to trade again.",
  },
  {
    title: "Exiting locks in the result.",
    detail: "Win or lose, once you Exit, that trade is done and recorded for good.",
  },
];

export function HowItWorks() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="rounded-md border border-border-strong bg-surface p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-body-sm font-medium text-foreground">How this works</span>
        <ChevronDown className={cn("size-4 text-foreground-muted transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && (
        <ol className="mt-3 space-y-2.5">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-2.5 text-body-sm">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-muted font-mono text-caption text-primary">
                {i + 1}
              </span>
              <span>
                <span className="text-foreground">{step.title}</span>{" "}
                <span className="text-foreground-muted">{step.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
