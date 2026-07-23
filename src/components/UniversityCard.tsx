import Link from "next/link";
import type { University } from "@/lib/data/universities";
import Reveal from "@/components/Reveal";
import SmartImage from "@/components/SmartImage";
import TiltCard from "@/components/TiltCard";
import RankingBadge from "@/components/RankingBadge";

export default function UniversityCard({
  university,
  countrySlug,
  accent,
  programCount,
  delay = 0,
}: {
  university: University;
  countrySlug: string;
  accent: string;
  programCount: number;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/destinations/${countrySlug}/universities/${university.slug}/`}
        className="group block h-full"
        draggable={false}
      >
        <TiltCard className="h-full">
          <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-shadow duration-300 group-hover:shadow-lg">
            <div className="relative h-36 overflow-hidden">
              <SmartImage
                src={university.heroPhoto}
                alt={university.name}
                accent={accent}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
              <div className="absolute left-4 top-4">
                <RankingBadge rankings={university.rankings} accent={accent} />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-lg font-bold">{university.name}</h3>
              {university.city && (
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-ink-mute">{university.city}</p>
              )}
              <p className="mt-2 flex-1 text-sm text-ink-soft">
                {university.tagline || `${programCount} program${programCount === 1 ? "" : "s"} available`}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: accent }}>
                View university
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </span>
            </div>
          </article>
        </TiltCard>
      </Link>
    </Reveal>
  );
}
