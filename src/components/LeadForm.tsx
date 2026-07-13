"use client";

import { useState } from "react";
import { destinations } from "@/lib/data/destinations";

const inputCls =
  "w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm font-medium outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export default function LeadForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          contact: form.get("contact"),
          destination: form.get("destination"),
          note: form.get("note"),
          channel: "web",
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="rounded-2xl bg-emerald-50 px-5 py-6 text-center text-sm font-bold text-emerald-700">
        ✅ Got it! A counselor will contact you within 24–48 hours.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          Couldn&apos;t send right now — please try WhatsApp instead.
        </p>
      )}
      <input name="name" placeholder="Your name" className={inputCls} />
      <input name="contact" required placeholder="Phone (WhatsApp) or email *" className={inputCls} />
      <select name="destination" defaultValue="" className={inputCls}>
        <option value="">Interested destination (optional)</option>
        {destinations.map((d) => (
          <option key={d.slug} value={d.slug}>{d.flag} {d.name}</option>
        ))}
      </select>
      <textarea name="note" rows={3} placeholder="Your question…" className={inputCls} />
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-3.5 font-bold text-white shadow-lg shadow-brand-600/25 transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Request a Call Back"}
      </button>
    </form>
  );
}
