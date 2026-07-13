import Link from "next/link";
import Reveal from "@/components/Reveal";

const schedule = [
  { time: "08:00 – 12:00", label: "Culinary classes", icon: "👨‍🍳", note: "Hands-on training in professional kitchens" },
  { time: "13:00 – 21:00", label: "Free to work", icon: "💼", note: "Earn while you study — restaurants, hotels, cafés" },
  { time: "After 1 year", label: "Certified & job-ready", icon: "🎓", note: "Job placement support + pathway to bring family once employed" },
];

export default function AlbaniaSpotlight() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-700">
            🇦🇱 Flagship Program
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            One Year in Albania.
            <span className="block bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
              A Lifetime of Skill.
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
            The culinary program built for people who want to move <em>now</em>: no age
            requirement, admissions open today, and a schedule designed so you can earn
            from your very first month.
          </p>
          <ul className="mt-6 grid max-w-lg grid-cols-2 gap-3 text-sm font-semibold text-ink">
            {["No age requirement", "1-year program", "Morning classes only", "Job support after graduation"].map((t) => (
              <li key={t} className="flex items-center gap-2 rounded-xl bg-brand-50 px-3.5 py-2.5">
                <span className="text-brand-600">✓</span> {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/apply/?destination=albania"
              className="rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-7 py-3.5 font-bold text-white shadow-xl shadow-red-600/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              Claim a Fee Waiver →
            </Link>
            <Link
              href="/destinations/albania/"
              className="rounded-full border-2 border-brand-200 px-7 py-3.5 font-bold text-brand-800 transition-colors hover:bg-brand-50"
            >
              Full Program Details
            </Link>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative rounded-3xl border border-brand-100 bg-white p-7 shadow-2xl shadow-brand-600/10">
            <span className="absolute -top-4 left-7 rounded-full bg-brand-950 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              A Day in Your New Life
            </span>
            <ul className="mt-4 space-y-5">
              {schedule.map((s, i) => (
                <li key={s.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-xl">{s.icon}</span>
                    {i < schedule.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-brand-100" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-brand-600">{s.time}</p>
                    <h3 className="font-display font-bold">{s.label}</h3>
                    <p className="mt-0.5 text-sm text-ink-soft">{s.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
