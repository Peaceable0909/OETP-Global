import CountUp from "@/components/CountUp";
import { stats } from "@/lib/data/site";
import { Icon, type IconName } from "@/lib/icons";

export default function DarkStatsBand() {
  return (
    <section className="bg-navy py-10 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 sm:grid-cols-3 lg:grid-cols-5 lg:px-8">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white/70" aria-hidden>
              <Icon name={s.icon as IconName} className="h-5 w-5" />
            </span>
            <div>
              <CountUp end={s.value} suffix={s.suffix} className="font-display text-xl font-extrabold sm:text-2xl" />
              <p className="text-[11px] font-semibold text-white/60">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
