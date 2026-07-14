import Reveal from "@/components/Reveal";
import { features } from "@/lib/data/site";
import { Icon, type IconName } from "@/lib/icons";

export default function FeatureStrip() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      <div className="grid gap-6 rounded-3xl border border-line bg-white p-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 70}>
            <div className="flex items-start gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-study-soft text-study" aria-hidden>
                <Icon name={f.icon as IconName} className="h-5 w-5" />
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
