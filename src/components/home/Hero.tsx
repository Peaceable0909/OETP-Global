"use client";

import Link from "next/link";
import Particles from "@/components/reactbits/Particles";
import { site, heroPhotos } from "@/lib/data/site";
import Flag from "@/components/Flag";
import SmartImage from "@/components/SmartImage";
import HeroSearch from "@/components/home/HeroSearch";
import Globe3D from "@/components/Globe3D";
import { MessageCircle, Plane, PlaneTakeoff } from "lucide-react";

const pins = [
  { code: "CY", color: "#0284C7", label: "Cyprus", x: "58%", y: "10%", cls: "animate-float" },
  { code: "AL", color: "#DC2626", label: "Albania", x: "84%", y: "38%", cls: "animate-float-slow" },
  { code: "MY", color: "#4F46E5", label: "Malaysia", x: "70%", y: "78%", cls: "animate-float" },
  { code: "KH", color: "#7C3AED", label: "Cambodia", x: "20%", y: "82%", cls: "animate-float-slow" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      {/* ambient blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-24 h-[26rem] w-[26rem] rounded-full bg-fuchsia-200/30 blur-3xl" />
      {/* WebGL particles are desktop-only: phones get the gradient blobs, saving GPU/battery */}
      <div className="pointer-events-none absolute inset-0 hidden opacity-60 lg:block">
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

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-700 shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-hot" />
            Study. Work. Succeed Anywhere.
          </span>

          <p className="mt-5 font-script text-3xl leading-none text-brand-600 sm:text-4xl">
            Your Passport to
          </p>
          <h1 className="mt-1 text-[clamp(2.6rem,1.6rem+5vw,4.4rem)] font-extrabold leading-[1.02]">
            {/* Plain CSS keyframe on the outer span, gradient+clip static on the inner span —
                GSAP SplitText promotes each character to its own compositing layer via
                will-change:transform, and a promoted descendant inside a bg-clip-text
                ancestor renders blank in Chrome (same root cause as the "Our Expertise." fix,
                one level deeper). No per-char stagger needed for a two-word headline anyway. */}
            <span className="block animate-[heroRise_0.8s_cubic-bezier(0.22,1,0.36,1)_0.15s_both]">
              <span className="bg-gradient-to-r from-brand-700 via-brand-500 to-fuchsia-500 bg-clip-text text-transparent">
                The World
              </span>
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
              Explore Destinations
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand-200 bg-white/80 px-7 py-3.5 font-bold text-brand-800 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400 hover:bg-brand-50"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" /> Talk to an Advisor
            </a>
          </div>

          <div className="mt-10">
            <HeroSearch />
          </div>
        </div>

        {/* 3D interactive globe + flight-path pins */}
        <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
          <div className="absolute inset-0">
            <Globe3D />
          </div>

          {pins.map((p) => (
            <span
              key={p.label}
              className={`pointer-events-none absolute z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-brand-200 bg-white/95 px-3 py-1.5 text-xs font-bold text-ink shadow-lg shadow-brand-600/10 ${p.cls}`}
              style={{ left: p.x, top: p.y }}
            >
              <Flag code={p.code} color={p.color} /> {p.label}
            </span>
          ))}

          <span className="pointer-events-none absolute bottom-[6%] left-[2%] flex items-center gap-1.5 rounded-full bg-hot px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-hot/30 animate-float">
            <PlaneTakeoff className="h-3.5 w-3.5" aria-hidden="true" /> Lagos
          </span>

          {/* floating photo cards, mockup-style */}
          <div className="pointer-events-none absolute right-[-4%] top-[26%] w-28 animate-float-slow overflow-hidden rounded-2xl border-4 border-white shadow-2xl shadow-brand-600/25 sm:w-32">
            <SmartImage src={heroPhotos.graduate} alt="Graduate abroad" className="aspect-[3/4] w-full object-cover" />
          </div>
          <div className="pointer-events-none absolute bottom-[-2%] right-[14%] w-32 animate-float overflow-hidden rounded-2xl border-4 border-white shadow-2xl shadow-brand-600/25 sm:w-36">
            <SmartImage src={heroPhotos.city} alt="Destination city" className="aspect-[4/3] w-full object-cover" />
          </div>
          <span className="pointer-events-none absolute left-[34%] top-[0%] animate-float-slow drop-shadow-lg" aria-hidden>
            <Plane className="h-10 w-10 rotate-[-20deg] fill-brand-600 text-brand-600" />
          </span>
        </div>
      </div>
    </section>
  );
}
