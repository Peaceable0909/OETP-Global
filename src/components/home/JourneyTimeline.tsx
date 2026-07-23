"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Backpack, Send, Mail, ShieldCheck, PlaneTakeoff } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// each step lights up in its functional color as the plane reaches it:
// choose = study blue, apply = telegram, offer = scholarship amber,
// visa = success green, fly = hot orange
const steps = [
  { icon: Backpack, title: "Choose Program", desc: "Pick your destination and program.", color: "#2563eb" },
  { icon: Send, title: "Apply Online", desc: "We help you build and submit the application.", color: "#229ed9" },
  { icon: Mail, title: "Get Offer", desc: "Receive your admission offer letter.", color: "#f59e0b" },
  { icon: ShieldCheck, title: "Visa Success", desc: "Guided document prep, submission, approval.", color: "#059669" },
  { icon: PlaneTakeoff, title: "Fly & Thrive", desc: "Arrival support and your new journey begins.", color: "#ea580c" },
];

export default function JourneyTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const badgeRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      if (!pathRef.current || !planeRef.current || !sectionRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const badges = badgeRefs.current.filter(Boolean) as HTMLSpanElement[];

      gsap.set(planeRef.current, {
        motionPath: {
          path: pathRef.current,
          align: pathRef.current,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 0,
        },
      });

      gsap.to(planeRef.current, {
        motionPath: {
          path: pathRef.current,
          align: pathRef.current,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 1,
        },
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          end: "bottom 65%",
          scrub: 0.7,
          onUpdate: (self) => {
            const lit = Math.floor(self.progress * badges.length);
            badges.forEach((b, i) => {
              const on = i <= lit;
              const wasOn = b.dataset.lit === "1";
              b.style.background = on ? steps[i].color : "rgba(255,255,255,0.08)";
              b.style.color = on ? "#ffffff" : "rgba(255,255,255,0.7)";
              if (on && !wasOn) {
                gsap.fromTo(b, { scale: 1 }, { scale: 1.18, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
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
    <section ref={sectionRef} className="relative overflow-hidden bg-navy py-24 text-white">

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          light
          eyebrow="How It Works"
          title="We Guide You Every Step"
          sub="Five clear stages. You always know where you stand, and what's free vs. paid, before you commit to anything."
        />

        <div className="relative mt-20">
          {/* the flight path — desktop only, drives the traveling plane */}
          <svg
            viewBox="0 0 1200 120"
            className="pointer-events-none absolute inset-x-0 -top-6 hidden w-full md:block"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              ref={pathRef}
              d="M 60 90 C 260 10, 340 150, 540 80 S 860 10, 1140 80"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="2"
              strokeDasharray="6 10"
            />
            <g ref={planeRef}>
              <polygon points="-9,0 9,0 0,-6" fill="#fbbf24" transform="rotate(90)" />
              <polygon points="-9,0 9,0 0,6" fill="#f59e0b" transform="rotate(90)" opacity="0.7" />
            </g>
          </svg>

          <ol className="relative grid gap-10 md:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.title} className="text-center">
                <Reveal delay={i * 110}>
                  <span
                    ref={(el) => {
                      badgeRefs.current[i] = el;
                    }}
                    className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10 shadow-lg shadow-black/20 transition-colors duration-300"
                  >
                    <s.icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <span className="mt-3 block font-display text-xs font-extrabold uppercase tracking-widest text-white/60">
                    Step {i + 1}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{s.desc}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
