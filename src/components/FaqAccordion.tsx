import Reveal from "@/components/Reveal";

type Faq = { q: string; a: string };

export default function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((f, i) => (
        <Reveal key={f.q} delay={i * 60}>
          <details className="group rounded-2xl border border-line bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-[15px] font-bold marker:hidden [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface text-ink-soft transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
