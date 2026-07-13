import Reveal from "@/components/Reveal";
import { features } from "@/lib/data/site";

export default function FeatureStrip() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      <div className="grid gap-6 rounded-3xl border border-brand-100 bg-white p-8 shadow-lg shadow-brand-600/8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 70}>
            <div className="flex items-start gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-100 text-xl" aria-hidden>
                {f.icon}
              </span>
              <div>
                <h3 className="font-display text-sm font-bold">{f.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{f.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
