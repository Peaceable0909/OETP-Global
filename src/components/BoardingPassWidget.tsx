"use client";

import { useEffect, useState } from "react";
import { PlaneTakeoff, X } from "lucide-react";
import { DOCUMENT_PORTAL_URL } from "@/lib/documentPortal";

export default function BoardingPassWidget() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 hidden animate-float sm:block">
      <div className="relative flex items-center gap-3 rounded-2xl border border-line bg-white py-2.5 pl-4 pr-3">
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
          className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-navy text-white shadow"
        >
          <X className="h-3 w-3" />
        </button>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-study text-white">
          <PlaneTakeoff className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink-soft">Your Future</p>
          <p className="flex items-center gap-1.5 font-display text-xs font-extrabold text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-500" /> Boarding
          </p>
        </div>
        <a
          href={DOCUMENT_PORTAL_URL}
          className="ml-1 rounded-full bg-navy px-3.5 py-2 text-xs font-bold text-white transition-transform hover:scale-105"
        >
          Apply
        </a>
      </div>
    </div>
  );
}
