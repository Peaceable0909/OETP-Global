"use client";

import { Plus, Trash2 } from "lucide-react";
import ImagePicker from "./ImagePicker";

type FieldType = "text" | "textarea" | "image";

export type FieldDef = {
  key: string;
  label: string;
  type?: FieldType;
  imageKind?: "program" | "specialization";
};

type Props = {
  label: string;
  items: Record<string, string>[];
  fields: FieldDef[];
  onChange: (items: Record<string, string>[]) => void;
  countrySlug: string;
};

export default function RepeatableEditor({ label, items, fields, onChange, countrySlug }: Props) {
  function emptyItem(): Record<string, string> {
    return Object.fromEntries(fields.map((f) => [f.key, ""]));
  }

  function updateItem(i: number, key: string, value: string) {
    const next = items.map((it, j) => (i === j ? { ...it, [key]: value } : it));
    onChange(next);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">{label}</h3>
        <button
          type="button"
          onClick={() => onChange([...items, emptyItem()])}
          className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700 hover:bg-brand-200"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      <div className="mt-2 space-y-4">
        {items.length === 0 && <p className="text-xs text-ink-soft">Nothing added yet.</p>}
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-brand-100 bg-brand-50/40 p-4">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className={f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : ""}>
                  {f.type === "image" ? (
                    <ImagePicker
                      label={f.label}
                      value={item[f.key] ?? ""}
                      onChange={(url) => updateItem(i, f.key, url)}
                      kind={f.imageKind ?? "program"}
                      countrySlug={countrySlug}
                    />
                  ) : (
                    <label className="block text-xs font-bold text-ink-soft">
                      {f.label}
                      {f.type === "textarea" ? (
                        <textarea
                          value={item[f.key] ?? ""}
                          onChange={(e) => updateItem(i, f.key, e.target.value)}
                          rows={2}
                          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                        />
                      ) : (
                        <input
                          value={item[f.key] ?? ""}
                          onChange={(e) => updateItem(i, f.key, e.target.value)}
                          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                        />
                      )}
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
