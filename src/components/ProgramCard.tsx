"use client";

import Link from "next/link";
import type { Program } from "@/lib/data/programs";
import Reveal from "@/components/Reveal";
import SmartImage from "@/components/SmartImage";

type CompareControls = { checked: boolean; disabled: boolean; onToggle: () => void };

export default function ProgramCard({
  program,
  countrySlug,
  universitySlug,
  accent,
  delay = 0,
  compare,
}: {
  program: Program;
  countrySlug: string;
  universitySlug: string;
  accent: string;
  delay?: number;
  compare?: CompareControls;
}) {
  const href = `/destinations/${countrySlug}/universities/${universitySlug}/programs/${program.slug}/`;

  return (
    <Reveal delay={delay} className="h-full">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-shadow duration-300 hover:shadow-lg">
        {compare && (
          <label className="absolute right-4 top-4 z-10 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold shadow">
            <input
              type="checkbox"
              checked={compare.checked}
              disabled={compare.disabled}
              onChange={compare.onToggle}
              className="h-3.5 w-3.5"
            />
            Compare
          </label>
        )}
        <Link href={href} className="flex flex-1 flex-col" draggable={false}>
          <div className="relative h-32 overflow-hidden">
            <SmartImage
              src={program.photo}
              alt={program.name}
              accent={accent}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            {program.degreeType && (
              <span
                className="mb-2 inline-block w-fit rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white"
                style={{ backgroundColor: accent }}
              >
                {program.degreeType}
              </span>
            )}
            <h3 className="font-display text-lg font-bold">{program.name}</h3>
            <p className="mt-2 flex-1 text-sm text-ink-soft">{program.overview}</p>
            <div className="mt-4 flex items-center justify-between text-sm font-bold">
              <span>
                {program.tuitionPerYear ? `${program.currency} ${program.tuitionPerYear.toLocaleString()}/yr` : "Tuition on request"}
              </span>
              <span style={{ color: accent }} className="inline-flex items-center gap-1">
                View
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </Reveal>
  );
}
