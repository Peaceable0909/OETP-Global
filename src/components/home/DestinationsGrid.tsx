import Link from "next/link";
import type { Destination } from "@/lib/data/destinations";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Flag from "@/components/Flag";
import SmartImage from "@/components/SmartImage";
import TiltCard from "@/components/TiltCard";

function DestinationCard({ d }: { d: Destination }) {
  return (
    <Link
      href={`/destinations/${d.slug}/`}
      className="group block h-full transition-transform duration-150 active:scale-[0.97]"
      draggable={false}
    >
      <TiltCard className="h-full">
        <article className="h-full overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-300 group-hover:shadow-lg sm:rounded-3xl">
          <div className="relative flex h-28 items-end overflow-hidden p-3.5 sm:h-44 sm:p-5">
            <SmartImage
              src={d.photo}
              alt={d.name}
              accent={d.accent}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="relative text-white">
              <h3 className="flex items-center gap-1.5 font-display text-base font-extrabold drop-shadow-sm sm:gap-2 sm:text-2xl">
                <Flag code={d.code} color={d.accent} className="h-5 min-w-[1.9rem] rounded-md px-1 text-[10px] sm:h-6 sm:min-w-[2.2rem] sm:rounded-lg sm:text-[11px]" /> {d.name}
              </h3>
              <p className="hidden text-sm font-semibold text-white/90 sm:block">{d.tagline}</p>
            </div>
          </div>

          <div className="space-y-2.5 p-3.5 sm:space-y-4 sm:p-6">
            <ul className="hidden space-y-2 text-sm text-ink-soft sm:block">
              {d.highlights.slice(0, 3).map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="mt-0.5" style={{ color: d.accent }}>✦</span>
                  {h}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold sm:gap-2 sm:text-[11px]">
              <span className="rounded-full bg-surface px-2.5 py-1 text-ink-soft sm:px-3">From {d.tuitionFrom}</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-success sm:px-3">Visa {d.visaProcessing}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 pt-0.5 text-[13px] font-bold sm:pt-1 sm:text-sm" style={{ color: d.accent }}>
              Explore<span className="hidden sm:inline">&nbsp;{d.name}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </span>
          </div>
        </article>
      </TiltCard>
    </Link>
  );
}

export default function DestinationsGrid({ destinations }: { destinations: Destination[] }) {
  return (
    <section className="relative bg-surface py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Destinations"
          title="Where Will Your Story Begin?"
          sub="Six destinations with straightforward admissions and visa processes — each one vetted, each one with real support on the ground."
        />

        {/* compact 2-up cards on mobile, the classic grid from sm up */}
        <div className="mt-14 grid grid-cols-2 gap-3.5 sm:gap-7 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <Reveal key={d.slug} delay={i * 80} className="h-full">
              <DestinationCard d={d} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
