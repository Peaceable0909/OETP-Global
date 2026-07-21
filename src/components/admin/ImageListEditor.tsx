"use client";

import { Plus, Trash2 } from "lucide-react";
import ImagePicker from "./ImagePicker";

type Props = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  kind: "university-gallery";
  countrySlug: string;
};

// Same shape as StringListEditor, but each row is an ImagePicker instead of a
// plain text input — used for gallery-style fields (an array of photo URLs)
// rather than a single hero image.
export default function ImageListEditor({ label, values, onChange, kind, countrySlug }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-ink">{label}</label>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700 hover:bg-brand-200"
        >
          <Plus className="h-3.5 w-3.5" /> Add photo
        </button>
      </div>
      <div className="mt-2 space-y-4">
        {values.length === 0 && <p className="text-xs text-ink-soft">No photos yet.</p>}
        {values.map((v, i) => (
          <div key={i} className="rounded-xl border border-line bg-brand-50/40 p-4">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => onChange(values.filter((_, j) => j !== i))}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
            <ImagePicker
              label={`Photo ${i + 1}`}
              value={v}
              onChange={(url) => {
                const next = [...values];
                next[i] = url;
                onChange(next);
              }}
              kind={kind}
              countrySlug={countrySlug}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
