"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

// Shared expand/collapse shell for anything that used to be a native
// <details> on this site (FAQ, tuition tables, module lists) — native
// <details> snaps open/closed with no transition, which is exactly the kind
// of "dead" interaction this page needed fewer of. Height animates via
// grid-template-rows (0fr <-> 1fr) so it doesn't need a guessed max-height.
export default function Accordion({
  title,
  defaultOpen = false,
  className = "",
  titleClassName = "",
  children,
}: {
  title: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  titleClassName?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-2xl border border-line bg-white ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-display text-sm font-bold ${titleClassName}`}
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-mute transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="px-6 pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
