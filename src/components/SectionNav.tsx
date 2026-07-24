"use client";

import { useEffect, useState } from "react";

export type NavSection = { id: string; label: string };

// Scrollspy "jump to" nav for long program-detail pages — every section
// used to look identical (H2 + fade-in box), which is what read as
// "scattered": no sense of where you are or how much is left. Two render
// modes share the same IntersectionObserver logic; each call site picks the
// one that fits its slot (mobile sticky pill strip vs. desktop sidebar list).
export default function SectionNav({
  sections,
  accent,
  variant,
}: {
  sections: NavSection[];
  accent: string;
  variant: "mobile" | "desktop";
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const elements = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    // Recompute from every element's live position rather than trusting only
    // the entries the observer happened to hand back — a plain "is any
    // section currently intersecting a narrow band" check can go stale
    // between two sections during a fast/large scroll jump, since neither
    // one crosses the observer's threshold at the moment it fires. Instead,
    // pick the last section (in document order) whose top has scrolled up
    // past the reference line — the standard, jump-proof scrollspy approach.
    const REFERENCE_LINE = 120;
    const recompute = () => {
      let current = elements[0];
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= REFERENCE_LINE) current = el;
      }
      setActiveId(current.id);
    };

    const io = new IntersectionObserver(recompute, { rootMargin: "0px 0px -60% 0px", threshold: 0 });
    elements.forEach((el) => io.observe(el));
    recompute();
    return () => io.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (variant === "desktop") {
    return (
      <nav aria-label="Jump to section" className="hidden lg:block">
        <ul className="space-y-0.5 border-l-2 border-line pl-4">
          {sections.map((s) => {
            const active = activeId === s.id;
            return (
              <li key={s.id} className="relative">
                {active && (
                  <span
                    className="absolute -left-[18px] top-1 h-[calc(100%-0.5rem)] w-0.5 rounded-full transition-all duration-300"
                    style={{ backgroundColor: accent }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className={`block w-full py-1.5 text-left text-sm font-semibold transition-colors ${
                    active ? "" : "text-ink-soft hover:text-ink"
                  }`}
                  style={active ? { color: accent } : undefined}
                >
                  {s.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    // The horizontal scroller needs its own overflow-x, but overflow set on
    // a sticky element neutralizes its own stickiness (the browser forces
    // overflow-y to a non-visible used value too, which breaks position:
    // sticky) — so the scroll box has to be a plain child, not the sticky
    // element itself.
    <nav
      aria-label="Jump to section"
      className="sticky top-16 z-30 -mx-5 border-b border-line bg-white/95 backdrop-blur-sm lg:hidden"
    >
      <div className="overflow-x-auto px-5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2">
          {sections.map((s) => {
            const active = activeId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className="shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors"
                style={
                  active
                    ? { backgroundColor: accent, borderColor: accent, color: "#fff" }
                    : { borderColor: "var(--color-line)", color: "var(--color-ink-soft)" }
                }
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
