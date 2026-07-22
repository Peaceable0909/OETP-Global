"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Program } from "@/lib/data/programs";
import SmartImage from "@/components/SmartImage";

export default function CompactProgramRow({
  program,
  countrySlug,
  universitySlug,
  accent,
  onNavigate,
}: {
  program: Program;
  countrySlug: string;
  universitySlug: string;
  accent: string;
  onNavigate?: () => void;
}) {
  const href = `/destinations/${countrySlug}/universities/${universitySlug}/programs/${program.slug}/`;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3 transition-colors active:bg-surface"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
        <SmartImage src={program.photo} alt={program.name} accent={accent} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        {program.degreeType && (
          <span
            className="mb-1 inline-block w-fit rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white"
            style={{ backgroundColor: accent }}
          >
            {program.degreeType}
          </span>
        )}
        <h3 className="truncate text-sm font-bold">{program.name}</h3>
        <p className="truncate text-xs font-semibold text-ink-soft">
          {program.tuitionPerYear ? `${program.currency} ${program.tuitionPerYear.toLocaleString()}/yr` : "Tuition on request"}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-ink-mute" aria-hidden="true" />
    </Link>
  );
}
