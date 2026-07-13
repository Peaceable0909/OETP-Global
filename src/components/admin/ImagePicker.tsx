"use client";

import { useState } from "react";
import { Upload, Link2 } from "lucide-react";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  kind: "country-hero" | "program" | "specialization" | "testimonial";
  countrySlug: string;
};

export default function ImagePicker({ label, value, onChange, kind, countrySlug }: Props) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("kind", kind);
      form.append("country_slug", countrySlug);
      const res = await fetch("/api/admin/images/upload", { method: "POST", body: form });
      const data = (await res.json().catch(() => null)) as { url?: string | null; warning?: string; error?: string } | null;
      if (!res.ok || !data) throw new Error(data?.error ?? "Upload failed");
      if (data.url) {
        onChange(data.url);
      } else {
        setError(data.warning ?? "Uploaded, but no public URL is configured yet.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-ink">{label}</label>
        <div className="flex gap-1 rounded-full bg-brand-50 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`rounded-full px-3 py-1 ${mode === "upload" ? "bg-white shadow text-brand-700" : "text-ink-soft"}`}
          >
            <Upload className="mr-1 inline h-3 w-3" /> Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`rounded-full px-3 py-1 ${mode === "url" ? "bg-white shadow text-brand-700" : "text-ink-soft"}`}
          >
            <Link2 className="mr-1 inline h-3 w-3" /> Paste URL
          </button>
        </div>
      </div>

      <div className="mt-2">
        {mode === "upload" ? (
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="w-full cursor-pointer rounded-lg border border-dashed border-brand-300 bg-brand-50/50 px-3 py-2.5 text-xs file:mr-3 file:rounded-full file:border-0 file:bg-brand-600 file:px-3 file:py-1 file:text-xs file:font-bold file:text-white"
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        )}
      </div>

      {uploading && <p className="mt-1 text-xs text-ink-soft">Uploading…</p>}
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
      {value && (
        <div className="mt-2 flex items-center gap-2">
          <img src={value} alt="" className="h-14 w-20 rounded-lg object-cover border border-brand-100" />
          <span className="truncate text-xs text-ink-soft">{value}</span>
        </div>
      )}
    </div>
  );
}
