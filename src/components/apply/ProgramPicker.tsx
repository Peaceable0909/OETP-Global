"use client";

import { useEffect, useState } from "react";

type ProgramOption = { slug: string; name: string; degreeType: string | null; universitySlug: string; universityName: string };

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium outline-none transition-all focus:border-study focus:ring-4 focus:ring-study-soft";

const OTHER_VALUE = "__other__";

export default function ProgramPicker({ destinationSlug, defaultValue }: { destinationSlug: string; defaultValue?: string }) {
  const [programs, setPrograms] = useState<ProgramOption[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [freeText, setFreeText] = useState(false);
  const [textValue, setTextValue] = useState(defaultValue ?? "");

  useEffect(() => {
    setFreeText(false);
    if (!destinationSlug || destinationSlug === "undecided") {
      setPrograms(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setPrograms(null);
    fetch(`/api/programs/by-destination?destination=${encodeURIComponent(destinationSlug)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { programs: ProgramOption[] }) => {
        if (!cancelled) setPrograms(data.programs ?? []);
      })
      .catch(() => {
        if (!cancelled) setPrograms([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [destinationSlug]);

  // No destination chosen yet — disabled placeholder, matches reference copy
  if (!destinationSlug) {
    return (
      <select disabled defaultValue="" className={`mt-1.5 ${inputCls} cursor-not-allowed opacity-60`}>
        <option value="">Choose a destination first</option>
      </select>
    );
  }

  // "Not sure yet" or nothing published for this destination or the fetch failed
  // — free text is the only option that never leaves the user stuck.
  const shouldUseFreeText = destinationSlug === "undecided" || freeText || (programs !== null && programs.length === 0);

  if (shouldUseFreeText) {
    return (
      <div>
        <input
          name="program"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="e.g. Culinary Arts, Nursing…"
          className={`mt-1.5 ${inputCls}`}
        />
        {freeText && programs && programs.length > 0 && (
          <button
            type="button"
            onClick={() => setFreeText(false)}
            className="mt-1.5 text-xs font-bold text-study hover:underline"
          >
            ← back to the list
          </button>
        )}
      </div>
    );
  }

  if (loading || programs === null) {
    return (
      <select disabled defaultValue="" className={`mt-1.5 ${inputCls} cursor-not-allowed opacity-60`}>
        <option value="">Loading programs…</option>
      </select>
    );
  }

  return (
    <select
      name="program"
      defaultValue=""
      onChange={(e) => {
        if (e.target.value === OTHER_VALUE) setFreeText(true);
      }}
      className={`mt-1.5 ${inputCls}`}
    >
      <option value="">Select a program (optional)</option>
      {programs.map((p) => (
        <option key={p.slug} value={`${p.name} — ${p.universityName}`}>
          {p.name} — {p.universityName}
        </option>
      ))}
      <option value={OTHER_VALUE}>Other / not listed</option>
    </select>
  );
}
