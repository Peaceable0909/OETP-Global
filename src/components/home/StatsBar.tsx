import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import { stats } from "@/lib/data/site";
import { Icon, type IconName } from "@/lib/icons";

export default function StatsBar() {
  return (
    <section className="relative z-10 mx-auto -mt-12 max-w-6xl px-5 lg:px-8">
      <Reveal>
        <div className="grid grid-cols-5 gap-1 rounded-3xl border border-line bg-white p-2.5 sm:gap-6 sm:p-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-study-soft text-study sm:h-11 sm:w-11 sm:rounded-2xl">
                <Icon name={s.icon as IconName} className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
              </span>
              <div>
                <CountUp
                  end={s.value}
                  suffix={s.suffix}
                  className="block font-display text-[13px] font-extrabold text-ink sm:text-2xl lg:text-[1.7rem]"
                />
                <p className="text-[7.5px] font-semibold leading-tight text-ink-soft sm:text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
