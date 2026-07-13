"use client";

import Link from "next/link";
import SplitText from "@/components/reactbits/SplitText";
import Particles from "@/components/reactbits/Particles";
import { site } from "@/lib/data/site";

const pins = [
  { flag: "🇨🇾", label: "Cyprus", x: "56%", y: "18%", cls: "animate-float" },
  { flag: "🇦🇱", label: "Albania", x: "78%", y: "42%", cls: "animate-float-slow" },
  { flag: "🇲🇾", label: "Malaysia", x: "64%", y: "72%", cls: "animate-float" },
  { flag: "🇰🇭", label: "Cambodia", x: "30%", y: "80%", cls: "animate-float-slow" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      {/* ambient blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-24 h-[26rem] w-[26rem] rounded-full bg-fuchsia-200/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <Particles
          particleColors={["#7c3aed", "#a583f7"]}
          particleCount={140}
          particleSpread={12}
          speed={0.06}
          particleBaseSize={70}
          moveParticlesOnHover={false}
          alphaParticles
          disableRotation
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-32 lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-700 shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-hot" />
            Study. Work. Succeed Anywhere.
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-[3.6rem]">
            <SplitText
              text="Your Journey."
              className="block"
              delay={40}
              duration={0.7}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 46 }}
              to={{ opacity: 1, y: 0 }}
            />
            <span className="block bg-gradient-to-r from-brand-600 via-brand-500 to-fuchsia-500 bg-clip-text text-transparent">
              <SplitText
                text="Our Expertise."
                className="block"
                delay={40}
                duration={0.7}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 46 }}
                to={{ opacity: 1, y: 0 }}
              />
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            {site.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/destinations/"
              className="group rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-7 py-3.5 font-bold text-white shadow-xl shadow-brand-600/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-600/40"
            >
              Explore Opportunities
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-brand-200 bg-white/80 px-7 py-3.5 font-bold text-brand-800 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400 hover:bg-brand-50"
            >
              💬 Talk to an Advisor
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5 text-[13px] font-semibold text-ink-soft">
            {["Fast admissions", "Visa guidance", "End-to-end support", "Transparent fees"].map((t) => (
              <span key={t} className="rounded-full bg-brand-100/70 px-3.5 py-1.5">✓ {t}</span>
            ))}
          </div>
        </div>

        {/* Globe + flight paths */}
        <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
          <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
            <defs>
              <radialGradient id="globeFill" cx="38%" cy="32%">
                <stop offset="0%" stopColor="#ede9fe" />
                <stop offset="100%" stopColor="#c4b0fb" />
              </radialGradient>
              <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="150" fill="url(#globeFill)" opacity="0.9" />
            {/* meridians / parallels */}
            <g stroke="#7c3aed" strokeOpacity="0.25" fill="none" strokeWidth="1">
              <ellipse cx="200" cy="200" rx="150" ry="150" />
              <ellipse cx="200" cy="200" rx="95" ry="150" />
              <ellipse cx="200" cy="200" rx="40" ry="150" />
              <ellipse cx="200" cy="200" rx="150" ry="95" />
              <ellipse cx="200" cy="200" rx="150" ry="40" />
              <line x1="50" y1="200" x2="350" y2="200" />
              <line x1="200" y1="50" x2="200" y2="350" />
            </g>
            {/* flight arcs from "Lagos" (lower-left) */}
            <g fill="none" stroke="url(#arc)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="8 10" className="animate-dash">
              <path d="M120 290 Q 170 120 250 92" />
              <path d="M120 290 Q 240 200 300 168" />
              <path d="M120 290 Q 220 300 262 268" />
            </g>
            <circle cx="120" cy="290" r="7" fill="#f97316" />
            <circle cx="120" cy="290" r="13" fill="#f97316" opacity="0.25" className="animate-pulse-soft" />
            <circle cx="250" cy="92" r="5" fill="#7c3aed" />
            <circle cx="300" cy="168" r="5" fill="#7c3aed" />
            <circle cx="262" cy="268" r="5" fill="#7c3aed" />
          </svg>

          {pins.map((p) => (
            <span
              key={p.label}
              className={`absolute flex items-center gap-1.5 rounded-full border border-brand-200 bg-white/95 px-3 py-1.5 text-xs font-bold text-ink shadow-lg shadow-brand-600/10 ${p.cls}`}
              style={{ left: p.x, top: p.y }}
            >
              <span className="text-base leading-none">{p.flag}</span> {p.label}
            </span>
          ))}

          <span className="absolute bottom-[12%] left-[6%] flex items-center gap-1.5 rounded-full bg-hot px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-hot/30 animate-float">
            🛫 Lagos
          </span>
        </div>
      </div>
    </section>
  );
}
