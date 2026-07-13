"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

const textCls =
  "mt-1 w-full rounded-lg border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export default function AdminSettingsPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [telegram, setTelegram] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setWhatsapp(data.settings.whatsapp ?? "");
        setTelegram(data.settings.telegram ?? "");
      }
      setLoading(false);
    })();
  }, []);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ whatsapp, telegram }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage({
        kind: "ok",
        text: "Saved. These links update everywhere on the site the next time it rebuilds (publish any country or wait for the next deploy).",
      });
    } catch {
      setMessage({ kind: "error", text: "Couldn't save. Try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-soft">Loading…</p>;

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="font-display text-xl font-bold">Contact Links</h2>
      <p className="text-sm text-ink-soft">
        These WhatsApp and Telegram links are used across the whole site — hero buttons, footer, FAQ, jobs, and more.
      </p>

      {message && (
        <p
          className={`rounded-xl px-4 py-3 text-sm font-semibold ${
            message.kind === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="rounded-2xl border border-brand-100 bg-white p-6">
        <label className="block text-xs font-bold text-ink-soft">
          WhatsApp link (e.g. https://wa.me/234...)
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={textCls} />
        </label>
        <label className="mt-4 block text-xs font-bold text-ink-soft">
          Telegram link (e.g. https://t.me/...)
          <input value={telegram} onChange={(e) => setTelegram(e.target.value)} className={textCls} />
        </label>
        <button
          onClick={save}
          disabled={saving}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/25 disabled:opacity-60"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Links"}
        </button>
      </div>
    </div>
  );
}
