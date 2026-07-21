"use client";

import { Plus, Trash2 } from "lucide-react";
import StringListEditor from "./StringListEditor";

type Module = { year: number; courses: string[] };

// A program's modules are grouped by year, each with its own list of
// courses — one level of nesting that RepeatableEditor's flat key/value
// fields can't express, so this gets its own small component instead of
// bending the generic one to fit.
export default function ModulesEditor({ modules, onChange }: { modules: Module[]; onChange: (m: Module[]) => void }) {
  function updateYear(i: number, year: number) {
    onChange(modules.map((m, j) => (i === j ? { ...m, year } : m)));
  }
  function updateCourses(i: number, courses: string[]) {
    onChange(modules.map((m, j) => (i === j ? { ...m, courses } : m)));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">Modules</h3>
        <button
          type="button"
          onClick={() => onChange([...modules, { year: modules.length + 1, courses: [] }])}
          className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700 hover:bg-brand-200"
        >
          <Plus className="h-3.5 w-3.5" /> Add year
        </button>
      </div>
      <div className="mt-2 space-y-4">
        {modules.length === 0 && <p className="text-xs text-ink-soft">No modules added yet.</p>}
        {modules.map((m, i) => (
          <div key={i} className="rounded-xl border border-line bg-brand-50/40 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-bold text-ink-soft">
                Year
                <input
                  type="number"
                  min={1}
                  value={m.year}
                  onChange={(e) => updateYear(i, Number(e.target.value) || 1)}
                  className="w-16 rounded-lg border border-line px-2 py-1 text-sm outline-none focus:border-brand-500"
                />
              </label>
              <button
                type="button"
                onClick={() => onChange(modules.filter((_, j) => j !== i))}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove year
              </button>
            </div>
            <StringListEditor
              label="Courses"
              values={m.courses}
              onChange={(courses) => updateCourses(i, courses)}
              placeholder="e.g. Introduction to Nutrition"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
