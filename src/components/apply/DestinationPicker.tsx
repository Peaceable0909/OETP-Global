"use client";

import type { Destination } from "@/lib/data/destinations";

export default function DestinationPicker({
  destinations,
  value,
  onChange,
}: {
  destinations: Destination[];
  value: string;
  onChange: (slug: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {destinations.map((d) => {
          const selected = value === d.slug;
          return (
            <button
              key={d.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(d.slug)}
              style={selected ? { backgroundColor: d.accent, borderColor: d.accent, color: "#fff" } : undefined}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                selected ? "" : "border-line bg-white text-ink hover:border-study"
              }`}
            >
              {d.name}
            </button>
          );
        })}
        <button
          type="button"
          aria-pressed={value === "undecided"}
          onClick={() => onChange("undecided")}
          className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
            value === "undecided" ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-study"
          }`}
        >
          Not sure yet — advise me
        </button>
      </div>
      <input type="hidden" name="destination" value={value} />
    </div>
  );
}
