import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import { stats } from "@/lib/data/site";

export default function StatsBar() {
  return (
    <section className="relative z-10 mx-auto -mt-12 max-w-6xl px-5 lg:px-8">
      <Reveal>
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-brand-100 bg-white/90 p-8 shadow-2xl shadow-brand-600/10 backdrop-blur-xl sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <CountUp
                end={s.value}
                suffix={s.suffix}
                className="font-display text-3xl font-extrabold text-brand-700 sm:text-4xl"
              />
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-soft sm:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
