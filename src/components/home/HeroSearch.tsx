"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Destination } from "@/lib/data/destinations";
import { Search } from "lucide-react";

const selectCls =
  "w-full appearance-none bg-transparent text-sm font-bold text-ink outline-none";

export default function HeroSearch({ destinations }: { destinations: Destination[] }) {
  const router = useRouter();
  const [intent, setIntent] = useState("study");
  const [country, setCountry] = useState("");
  const [program, setProgram] = useState("");

  const programs = useMemo(() => {
    const set = new Set<string>();
    destinations.forEach((d) => d.programs.forEach((p) => set.add(p.name)));
    return Array.from(set);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (intent === "work") {
      router.push("/jobs/");
      return;
    }
    if (country) {
      router.push(`/destinations/${country}/?program=${encodeURIComponent(program)}`);
      return;
    }
    router.push("/destinations/");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-3xl border border-brand-100 bg-white/95 p-3 shadow-2xl shadow-brand-600/15 backdrop-blur-sm sm:grid-cols-[1fr_1fr_1fr_auto] sm:gap-0 sm:divide-x sm:divide-brand-100"
    >
      <label className="block px-3 py-1.5 sm:py-2">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-soft">I want to</span>
        <select value={intent} onChange={(e) => setIntent(e.target.value)} className={selectCls}>
          <option value="study">Study Abroad</option>
          <option value="work">Work Abroad</option>
        </select>
      </label>

      <label className="block px-3 py-1.5 sm:py-2">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-soft">Where to?</span>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectCls}>
          <option value="">Any Country</option>
          {destinations.map((d) => (
            <option key={d.slug} value={d.slug}>{d.name}</option>
          ))}
        </select>
      </label>

      <label className="block px-3 py-1.5 sm:py-2">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-soft">What program?</span>
        <select value={program} onChange={(e) => setProgram(e.target.value)} className={selectCls}>
          <option value="">Any Program</option>
          {programs.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition-transform hover:scale-[1.02] sm:mt-0"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        Find My Future
      </button>
    </form>
  );
}
