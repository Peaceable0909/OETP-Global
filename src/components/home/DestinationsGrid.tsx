import Link from "next/link";
import { destinations } from "@/lib/data/destinations";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import Flag from "@/components/Flag";

export default function DestinationsGrid() {
  return (
    <section className="relative bg-gradient-to-b from-white via-brand-50/60 to-white py-24">
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
                <SpotlightCard
                  className="h-full border border-brand-100 bg-white shadow-lg shadow-brand-600/8 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-brand-600/15"
                  spotlightColor="rgba(124, 58, 237, 0.14)"
                >
                  <div className="relative flex h-44 items-end overflow-hidden p-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.photo}
                      alt={d.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${d.heroGradient} opacity-30`} />
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
                          <span className="mt-0.5 text-brand-600">✦</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                      <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-800">From {d.tuitionFrom}</span>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">Visa {d.visaProcessing}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-bold text-brand-700">
                      Explore {d.name}
                      <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                    </span>
                  </div>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
