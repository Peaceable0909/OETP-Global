"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { FileEdit, ClipboardCheck, Mail, ShieldCheck, GraduationCap } from "lucide-react";
import Reveal from "@/components/Reveal";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Same scroll-scrubbed flying-icon technique as the homepage's
// JourneyTimeline (SVG motion path + a traveling marker that lights up each
// badge as it passes) — this page-level stepper gets the same treatment
// instead of a lesser, static-page-only version. The path is desktop-only
// (sm:block), so badges default to their real color outright and the
// scroll-scrub only neutralizes-then-relights them when it actually runs.
const stages = [
  { icon: FileEdit, title: "Apply", color: "#2563eb" },
  { icon: ClipboardCheck, title: "Document Review", color: "#475569" },
  { icon: Mail, title: "Offer", color: "#f59e0b" },
  { icon: ShieldCheck, title: "Visa", color: "#059669" },
  { icon: GraduationCap, title: "Enrollment", color: "#ea580c" },
];

export default function ApplicationTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const badgeRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      if (!pathRef.current || !planeRef.current || !sectionRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const badges = badgeRefs.current.filter(Boolean) as HTMLSpanElement[];

      // Below sm the steps wrap into a 2-column grid, so there's no single
      // row for a plane to follow — instead light each badge up in sequence,
      // once, as the section scrolls into view. Same "steps activating"
      // feel as the desktop flight path, without needing a matching path.
      if (!window.matchMedia("(min-width: 640px)").matches) {
        gsap.set(badges, { backgroundColor: "var(--color-surface)", color: "var(--color-ink-mute)" });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            badges.forEach((b, i) => {
              tl.to(b, { backgroundColor: stages[i].color, color: "#ffffff", scale: 1.2, duration: 0.25, ease: "power2.out" }, i * 0.18).to(
                b,
                { scale: 1, duration: 0.2, ease: "power2.inOut" },
                i * 0.18 + 0.25
              );
            });
          },
        });
        return;
      }

      gsap.set(badges, { backgroundColor: "var(--color-surface)", color: "var(--color-ink-mute)" });

      gsap.set(planeRef.current, {
        motionPath: { path: pathRef.current, align: pathRef.current, alignOrigin: [0.5, 0.5], autoRotate: true, start: 0, end: 0 },
      });

      gsap.to(planeRef.current, {
        motionPath: { path: pathRef.current, align: pathRef.current, alignOrigin: [0.5, 0.5], autoRotate: true, start: 0, end: 1 },
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 55%",
          scrub: 0.7,
          onUpdate: (self) => {
            const lit = Math.floor(self.progress * badges.length);
            badges.forEach((b, i) => {
              const on = i <= lit;
              const wasOn = b.dataset.lit === "1";
              gsap.to(b, { backgroundColor: on ? stages[i].color : "var(--color-surface)", color: on ? "#ffffff" : "var(--color-ink-mute)", duration: 0.25 });
              if (on && !wasOn) {
                gsap.fromTo(b, { scale: 1 }, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" });
              }
              b.dataset.lit = on ? "1" : "0";
            });
          },
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className="relative">
      {/* the flight path — desktop only (matches the homepage version), drives the traveling plane */}
      <svg
        viewBox="0 0 1000 100"
        className="pointer-events-none absolute inset-x-0 -top-2 hidden w-full sm:block"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d="M 50 48 C 220 5, 280 90, 450 45 S 720 5, 950 45"
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="2"
          strokeDasharray="6 8"
        />
        <g ref={planeRef}>
          <polygon points="-8,0 8,0 0,-6" fill="#ea580c" transform="rotate(90)" />
          <polygon points="-8,0 8,0 0,6" fill="#c2410c" transform="rotate(90)" opacity="0.75" />
        </g>
      </svg>

      <ol className="relative grid grid-cols-2 gap-6 sm:grid-cols-5">
        {stages.map((s, i) => (
          <Reveal key={s.title} delay={i * 90}>
            <li className="text-center">
              <span
                ref={(el) => {
                  badgeRefs.current[i] = el;
                }}
                className="relative z-10 mx-auto grid h-12 w-12 place-items-center rounded-2xl text-white shadow-sm ring-4 ring-white transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: s.color }}
              >
                <s.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="mt-2 block text-[11px] font-extrabold uppercase tracking-wider text-ink-mute">
                Step {i + 1}
              </span>
              <h4 className="mt-0.5 text-sm font-bold">{s.title}</h4>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
