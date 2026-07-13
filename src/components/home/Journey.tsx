import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { journey } from "@/lib/data/site";

export default function Journey() {
  return (
    <section className="relative overflow-hidden bg-brand-950 py-24 text-white">
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          light
          eyebrow="✈️ How It Works"
          title="From Application to Arrival"
          sub="Five clear steps. You always know where you stand, what's free, and what's paid — before you commit to anything."
        />

        <ol className="relative mt-16 grid gap-10 md:grid-cols-5">
          {/* connecting line */}
          <div aria-hidden className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-brand-500/0 via-brand-400/60 to-brand-500/0 md:block" />
          {journey.map((j, i) => (
            <Reveal key={j.step} delay={i * 110}>
              <li className="relative text-center md:text-left">
                <span className="relative z-10 inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-lg font-extrabold shadow-lg shadow-brand-600/40">
                  {j.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{j.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-200/85">{j.desc}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
