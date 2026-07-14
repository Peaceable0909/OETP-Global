"use client";

import { Plus, Trash2 } from "lucide-react";

type Props = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export default function StringListEditor({ label, values, onChange, placeholder }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-ink">{label}</label>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700 hover:bg-brand-200"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {values.length === 0 && <p className="text-xs text-ink-soft">Nothing added yet.</p>}
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={v}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg border border-red-200 px-2.5 text-red-600 hover:bg-red-50"
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
