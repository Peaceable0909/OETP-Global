"use client";

import ScrollStack, { ScrollStackItem } from "@/components/reactbits/ScrollStack";

type Step = { title: string; detail: string };

// The destination page's visa steps as a scroll stack: each step card pins
// below the sticky tab nav and the next one slides over it.
export default function VisaStepsStack({ steps, accent }: { steps: Step[]; accent: string }) {
  return (
    <ScrollStack topOffset={132} peek={12} gap={28}>
      {steps.map((s, i) => (
        <ScrollStackItem key={s.title}>
          <div className="flex gap-5 rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-7">
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-display text-lg font-extrabold text-white"
              style={{ backgroundColor: accent }}
            >
              {i + 1}
            </span>
            <div>
              <h3 className="font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft sm:text-[15px]">{s.detail}</p>
            </div>
          </div>
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
}
