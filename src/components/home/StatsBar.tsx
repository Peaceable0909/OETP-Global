import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import { stats } from "@/lib/data/site";
import { Icon, type IconName } from "@/lib/icons";

export default function StatsBar() {
  return (
    <section className="relative z-10 mx-auto -mt-12 max-w-6xl px-5 lg:px-8">
      <Reveal>
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-brand-100 bg-white/90 p-8 shadow-2xl shadow-brand-600/10 backdrop-blur-xl sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-700" aria-hidden>
                <Icon name={s.icon as IconName} className="h-5 w-5" />
              </span>
              <div>
                <CountUp
                  end={s.value}
                  suffix={s.suffix}
                  className="font-display text-2xl font-extrabold text-ink sm:text-[1.7rem]"
                />
                <p className="text-[11px] font-semibold text-ink-soft sm:text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
