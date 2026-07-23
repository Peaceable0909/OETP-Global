"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Program } from "@/lib/data/programs";
import ProgramCard from "@/components/ProgramCard";
import CompactProgramRow from "@/components/CompactProgramRow";
import { formatMoney } from "@/lib/currency";

const MAX_COMPARE = 3;
const MOBILE_PREVIEW_COUNT = 3;

// The grid + the slide-up comparison tray share selection state, so they
// live in one client component rather than threading state back up to the
// (server) page that renders this.
export default function ProgramsCompare({
  programs,
  countrySlug,
  universitySlug,
  accent,
}: {
  programs: Program[];
  countrySlug: string;
  universitySlug: string;
  accent: string;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const toggle = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length < MAX_COMPARE ? [...prev, slug] : prev
    );
  };

  const compared = programs.filter((p) => selected.includes(p.slug));

  return (
    <>
      {/* Mobile: a handful of compact rows instead of the full tall-card grid, which */}
      {/* eats the whole screen once a university has more than a few programs. */}
      <div className="space-y-3 sm:hidden">
        {programs.slice(0, MOBILE_PREVIEW_COUNT).map((p) => (
          <CompactProgramRow key={p.slug} program={p} countrySlug={countrySlug} universitySlug={universitySlug} accent={accent} />
        ))}
        {programs.length > MOBILE_PREVIEW_COUNT && (
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="w-full rounded-full border-2 px-5 py-3 text-sm font-bold"
            style={{ borderColor: accent, color: accent }}
          >
            View all {programs.length} programs →
          </button>
        )}
      </div>

      <div className="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((p, i) => (
          <ProgramCard
            key={p.slug}
            program={p}
            countrySlug={countrySlug}
            universitySlug={universitySlug}
            accent={accent}
            delay={i * 60}
            compare={{
              checked: selected.includes(p.slug),
              disabled: !selected.includes(p.slug) && selected.length >= MAX_COMPARE,
              onToggle: () => toggle(p.slug),
            }}
          />
        ))}
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-[100] sm:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPreviewOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">All {programs.length} Programs</h3>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                aria-label="Close"
                className="rounded-full bg-surface p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {programs.map((p) => (
                <CompactProgramRow
                  key={p.slug}
                  program={p}
                  countrySlug={countrySlug}
                  universitySlug={universitySlug}
                  accent={accent}
                  onNavigate={() => setPreviewOpen(false)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {compared.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur">
          <div className="mx-auto max-w-6xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold">
                Comparing {compared.length} program{compared.length > 1 ? "s" : ""}
                {compared.length === 1 && " — select another to compare"}
              </p>
              <button
                type="button"
                onClick={() => setSelected([])}
                className="inline-flex items-center gap-1 text-xs font-bold text-ink-soft hover:text-ink"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" /> Clear
              </button>
            </div>
            {compared.length > 1 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="text-xs font-bold uppercase tracking-wider text-ink-mute">
                      <th className="py-2 pr-4">Program</th>
                      <th className="py-2 pr-4">Tuition/yr</th>
                      <th className="py-2 pr-4">Duration</th>
                      <th className="py-2 pr-4">Min IELTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compared.map((p) => (
                      <tr key={p.slug} className="border-t border-line">
                        <td className="py-2 pr-4 font-bold">{p.name}</td>
                        <td className="py-2 pr-4">
                          {p.tuitionPerYear ? formatMoney(p.tuitionPerYear, p.currency) : "On request"}
                        </td>
                        <td className="py-2 pr-4">{p.durationMonths ? `${p.durationMonths} months` : "—"}</td>
                        <td className="py-2 pr-4">{p.minIelts ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
