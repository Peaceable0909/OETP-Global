import Link from "next/link";
import type { Destination } from "@/lib/data/destinations";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Flag from "@/components/Flag";
import SmartImage from "@/components/SmartImage";

export default function DestinationsGrid({ destinations }: { destinations: Destination[] }) {
  return (
    <section className="relative bg-surface py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Destinations"
          title="Where Will Your Story Begin?"
          sub="Six destinations with straightforward admissions and visa processes — each one vetted, each one with real support on the ground."
        />

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <Reveal key={d.slug} delay={i * 80} className="h-full">
              <Link href={`/destinations/${d.slug}/`} className="group block h-full">
                <article className="h-full overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lg">
                  <div className="relative flex h-44 items-end overflow-hidden p-5">
                    <SmartImage
                      src={d.photo}
                      alt={d.name}
                      accent={d.accent}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <div className="relative text-white">
                      <h3 className="flex items-center gap-2 font-display text-2xl font-extrabold drop-shadow-sm">
                        <Flag code={d.code} color={d.accent} className="h-6 min-w-[2.2rem] rounded-lg px-1 text-[11px]" /> {d.name}
                      </h3>
                      <p className="text-sm font-semibold text-white/90">{d.tagline}</p>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <ul className="space-y-2 text-sm text-ink-soft">
                      {d.highlights.slice(0, 3).map((h) => (
                        <li key={h} className="flex gap-2">
                          <span className="mt-0.5" style={{ color: d.accent }}>✦</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                      <span className="rounded-full bg-surface px-3 py-1 text-ink-soft">From {d.tuitionFrom}</span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-success">Visa {d.visaProcessing}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-bold" style={{ color: d.accent }}>
                      Explore {d.name}
                      <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                    </span>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
