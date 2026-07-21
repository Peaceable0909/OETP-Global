"use client";

import type { SearchFacets, FilterState } from "@/lib/search";

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div className="border-b border-line py-4 first:pt-0 last:border-b-0">
      <h4 className="text-xs font-bold uppercase tracking-wider text-ink-mute">{label}</h4>
      <div className="mt-2.5 space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onChange(toggle(selected, opt))}
              className="h-4 w-4 accent-study"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

// Same markup renders inline as the desktop sticky rail and inside the
// mobile bottom sheet — the two contexts differ only in their container.
export default function FilterRail({
  facets,
  value,
  onChange,
}: {
  facets: SearchFacets;
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  function set<K extends keyof FilterState>(key: K, v: FilterState[K]) {
    onChange({ ...value, [key]: v });
  }

  const countryOptions = facets.countries.map((c) => c.name);
  const countryNameToSlug = new Map(facets.countries.map((c) => [c.name, c.slug]));
  const countrySlugToName = new Map(facets.countries.map((c) => [c.slug, c.name]));

  const universityOptions = facets.universities.map((u) => u.name);
  const universityNameToSlug = new Map(facets.universities.map((u) => [u.name, u.slug]));
  const universitySlugToName = new Map(facets.universities.map((u) => [u.slug, u.name]));

  return (
    <div>
      <CheckboxGroup
        label="Country"
        options={countryOptions}
        selected={value.country.map((slug) => countrySlugToName.get(slug) ?? slug)}
        onChange={(names) => set("country", names.map((n) => countryNameToSlug.get(n) ?? n))}
      />
      <CheckboxGroup
        label="University"
        options={universityOptions}
        selected={value.university.map((slug) => universitySlugToName.get(slug) ?? slug)}
        onChange={(names) => set("university", names.map((n) => universityNameToSlug.get(n) ?? n))}
      />
      <CheckboxGroup label="Degree level" options={facets.degreeTypes} selected={value.degreeType} onChange={(v) => set("degreeType", v)} />
      <CheckboxGroup label="Subject area" options={facets.fieldsOfStudy} selected={value.fieldOfStudy} onChange={(v) => set("fieldOfStudy", v)} />

      {facets.tuitionRange.min != null && (
        <div className="border-b border-line py-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-mute">
            Tuition / year ({facets.tuitionRange.min.toLocaleString()}–{facets.tuitionRange.max?.toLocaleString()})
          </h4>
          <div className="mt-2.5 flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={value.minTuition}
              onChange={(e) => set("minTuition", e.target.value)}
              className="w-full rounded-lg border border-line px-2.5 py-1.5 text-sm outline-none focus:border-study"
            />
            <input
              type="number"
              placeholder="Max"
              value={value.maxTuition}
              onChange={(e) => set("maxTuition", e.target.value)}
              className="w-full rounded-lg border border-line px-2.5 py-1.5 text-sm outline-none focus:border-study"
            />
          </div>
        </div>
      )}

      {facets.durationRange.min != null && (
        <div className="border-b border-line py-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-mute">
            Duration in months ({facets.durationRange.min}–{facets.durationRange.max})
          </h4>
          <div className="mt-2.5 flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={value.minDuration}
              onChange={(e) => set("minDuration", e.target.value)}
              className="w-full rounded-lg border border-line px-2.5 py-1.5 text-sm outline-none focus:border-study"
            />
            <input
              type="number"
              placeholder="Max"
              value={value.maxDuration}
              onChange={(e) => set("maxDuration", e.target.value)}
              className="w-full rounded-lg border border-line px-2.5 py-1.5 text-sm outline-none focus:border-study"
            />
          </div>
        </div>
      )}

      <CheckboxGroup label="Intake month" options={facets.intakeMonths} selected={value.intakeMonth} onChange={(v) => set("intakeMonth", v)} />

      {facets.ieltsRange.min != null && (
        <div className="border-b border-line py-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-mute">Your IELTS score</h4>
          <input
            type="number"
            step="0.5"
            placeholder="e.g. 6.0"
            value={value.maxIelts}
            onChange={(e) => set("maxIelts", e.target.value)}
            className="mt-2.5 w-full rounded-lg border border-line px-2.5 py-1.5 text-sm outline-none focus:border-study"
          />
          <p className="mt-1 text-xs text-ink-mute">Shows programs whose requirement is at or below this score.</p>
        </div>
      )}

      {facets.hasScholarships && (
        <div className="border-b border-line py-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-ink">
            <input
              type="checkbox"
              checked={value.scholarship}
              onChange={(e) => set("scholarship", e.target.checked)}
              className="h-4 w-4 accent-study"
            />
            Scholarship available
          </label>
        </div>
      )}

      <CheckboxGroup label="Work rights" options={facets.workRights} selected={value.workRights} onChange={(v) => set("workRights", v)} />
      <CheckboxGroup
        label="Visa processing time"
        options={facets.visaProcessing}
        selected={value.visaProcessing}
        onChange={(v) => set("visaProcessing", v)}
      />
    </div>
  );
}
