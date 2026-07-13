import Reveal from "@/components/Reveal";

type Faq = { q: string; a: string };

export default function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((f, i) => (
        <Reveal key={f.q} delay={i * 60}>
          <details className="group rounded-2xl border border-brand-100 bg-white shadow-sm shadow-brand-600/5 open:shadow-lg open:shadow-brand-600/10">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-[15px] font-bold marker:hidden [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700 transition-transform duration-300 group-open:rotate-45">
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
