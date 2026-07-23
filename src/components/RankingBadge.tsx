// Only renders when at least one real rank exists — a fabricated rank is
// worse than no rank, so there is no placeholder/"unranked" state to design
// for here. Rankings are an arbitrary {label, value} list (e.g. "Thailand" /
// "Asia" / "World") rather than fixed national/world fields, since a
// university's most meaningful rank is often regional and there's no way to
// know every label in advance.
export default function RankingBadge({
  rankings,
  accent,
}: {
  rankings?: { label: string; value: number }[];
  accent: string;
}) {
  if (!rankings || rankings.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {rankings.map((r, i) => (
        <span
          key={`${r.label}-${i}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-extrabold shadow"
          style={{ color: i === 0 ? accent : undefined }}
        >
          #{r.value} {r.label}
        </span>
      ))}
    </div>
  );
}
