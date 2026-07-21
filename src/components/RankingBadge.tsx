// Only renders when a real rank exists — a fabricated rank is worse than no
// rank, so there is no placeholder/"unranked" state to design for here.
export default function RankingBadge({
  national,
  world,
  accent,
}: {
  national?: number | null;
  world?: number | null;
  accent: string;
}) {
  if (national == null && world == null) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {national != null && (
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-extrabold shadow"
          style={{ color: accent }}
        >
          #{national} National
        </span>
      )}
      {world != null && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-extrabold text-ink shadow">
          #{world} World
        </span>
      )}
    </div>
  );
}
