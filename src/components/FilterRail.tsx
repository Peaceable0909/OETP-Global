"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { SearchFacets, FilterState } from "@/lib/search";

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

// A collapsible section shared by every facet group below — keeps the sheet
// scannable instead of dumping every filter as one long flat scroll. Height
// animates via grid-template-rows (0fr <-> 1fr) rather than max-height, so it
// doesn't need a guessed pixel cap for content of varying length.
function Section({
  title,
  count = 0,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-1 first:pt-0 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-mute">
          {title}
          {count > 0 && (
            <span className="rounded-full bg-study-soft px-1.5 py-0.5 text-[10px] font-extrabold text-study">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-mute transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
  defaultOpen,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  defaultOpen?: boolean;
}) {
  if (options.length === 0) return null;
  return (
    <Section title={label} count={selected.length} defaultOpen={defaultOpen ?? selected.length > 0}>
      <div className="space-y-2">
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
    </Section>
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

  const tuitionCount = value.minTuition || value.maxTuition ? 1 : 0;
  const durationCount = value.minDuration || value.maxDuration ? 1 : 0;
  const ieltsCount = value.maxIelts ? 1 : 0;

  return (
    <div>
      <CheckboxGroup
        label="Country"
        options={countryOptions}
        selected={value.country.map((slug) => countrySlugToName.get(slug) ?? slug)}
        onChange={(names) => set("country", names.map((n) => countryNameToSlug.get(n) ?? n))}
        defaultOpen
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
        <Section title="Tuition / year" count={tuitionCount} defaultOpen={tuitionCount > 0}>
          <p className="mb-2.5 text-xs text-ink-mute">
            Range: {facets.tuitionRange.min.toLocaleString()}–{facets.tuitionRange.max?.toLocaleString()}
          </p>
          <div className="flex gap-2">
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
        </Section>
      )}

      {facets.durationRange.min != null && (
        <Section title="Duration in months" count={durationCount} defaultOpen={durationCount > 0}>
          <p className="mb-2.5 text-xs text-ink-mute">
            Range: {facets.durationRange.min}–{facets.durationRange.max}
          </p>
          <div className="flex gap-2">
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
        </Section>
      )}

      <CheckboxGroup label="Intake month" options={facets.intakeMonths} selected={value.intakeMonth} onChange={(v) => set("intakeMonth", v)} />

      {facets.ieltsRange.min != null && (
        <Section title="Your IELTS score" count={ieltsCount} defaultOpen={ieltsCount > 0}>
          <input
            type="number"
            step="0.5"
            placeholder="e.g. 6.0"
            value={value.maxIelts}
            onChange={(e) => set("maxIelts", e.target.value)}
            className="w-full rounded-lg border border-line px-2.5 py-1.5 text-sm outline-none focus:border-study"
          />
          <p className="mt-1 text-xs text-ink-mute">Shows programs whose requirement is at or below this score.</p>
        </Section>
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
