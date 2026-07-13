import SectionHeading from "@/components/SectionHeading";
import { testimonials } from "@/lib/data/site";

export default function Testimonials() {
  const loop = [...testimonials, ...testimonials];
  return (
    <section className="overflow-hidden bg-gradient-to-b from-white to-brand-50/70 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="💜 Success Stories"
          title="They Took the Leap. So Can You."
          sub="Real students, real visas, real new lives."
        />
      </div>

      <div className="relative mt-14">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-brand-50 to-transparent" />
        <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused]">
          {loop.map((t, i) => (
            <figure
              key={i}
              className="w-[22rem] shrink-0 rounded-3xl border border-brand-100 bg-white p-7 shadow-lg shadow-brand-600/8"
            >
              <div className="flex text-sm text-amber-400" aria-hidden>★★★★★</div>
              <blockquote className="mt-3 text-sm leading-relaxed text-ink-soft">“{t.text}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display text-sm font-bold text-white">
                  {t.name[0]}
                </span>
                <span>
                  <span className="block text-sm font-bold">{t.name}</span>
                  <span className="block text-xs font-semibold text-brand-600">Now in {t.destination}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
