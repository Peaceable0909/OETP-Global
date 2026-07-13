import CountUp from "@/components/CountUp";
import { stats } from "@/lib/data/site";

export default function DarkStatsBand() {
  return (
    <section className="bg-brand-950 py-10 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 sm:grid-cols-3 lg:grid-cols-5 lg:px-8">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lg" aria-hidden>
              {s.icon}
            </span>
            <div>
              <CountUp end={s.value} suffix={s.suffix} className="font-display text-xl font-extrabold sm:text-2xl" />
              <p className="text-[11px] font-semibold text-brand-300">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
