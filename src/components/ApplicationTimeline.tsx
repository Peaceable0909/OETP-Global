"use client";

import { useEffect, useRef, useState } from "react";
import { FileEdit, ClipboardCheck, Mail, ShieldCheck, GraduationCap } from "lucide-react";
import Reveal from "@/components/Reveal";

// A simpler, static cousin of the homepage's JourneyTimeline (no GSAP
// scroll-scrubbing) — this is a secondary-page reference stepper, not a hero
// moment, so it doesn't need that machinery.
const stages = [
  { icon: FileEdit, title: "Apply", color: "#2563eb" },
  { icon: ClipboardCheck, title: "Document Review", color: "#475569" },
  { icon: Mail, title: "Offer", color: "#f59e0b" },
  { icon: ShieldCheck, title: "Visa", color: "#059669" },
  { icon: GraduationCap, title: "Enrollment", color: "#ea580c" },
];

const DRAW_MS = 1400;

export default function ApplicationTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[10%] right-[10%] top-6 hidden h-0.5 bg-line sm:block" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-study via-scholar to-hot-deep transition-transform duration-[1400ms] ease-out"
          style={{ transformOrigin: "left", transform: `scaleX(${drawn ? 1 : 0})` }}
        />
        {/* a traveling signal that races the line as it draws, instead of the
            line just appearing — reads as one continuous motion rather than
            a static bar snapping into place */}
        <span
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_3px_var(--color-hot),0_0_14px_4px_rgba(234,88,12,0.55)] transition-[left] ease-out"
          style={{ left: drawn ? "100%" : "0%", transitionDuration: `${DRAW_MS}ms`, marginLeft: drawn ? "-6px" : "-6px" }}
          aria-hidden="true"
        />
      </div>
      <ol className="relative grid grid-cols-2 gap-6 sm:grid-cols-5">
        {stages.map((s, i) => {
          const delay = (i / (stages.length - 1)) * DRAW_MS;
          return (
            <Reveal key={s.title} delay={i * 90}>
              <li className="text-center">
                <span
                  className="mx-auto grid h-12 w-12 place-items-center rounded-2xl text-white shadow-sm ring-4 ring-white transition-transform duration-300 hover:scale-110"
                  style={{
                    backgroundColor: s.color,
                    animation: drawn ? `iconPop 0.5s ease-out ${delay}ms both` : undefined,
                  }}
                >
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="mt-2 block text-[11px] font-extrabold uppercase tracking-wider text-ink-mute">
                  Step {i + 1}
                </span>
                <h4 className="mt-0.5 text-sm font-bold">{s.title}</h4>
              </li>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}
