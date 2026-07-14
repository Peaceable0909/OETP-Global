"use client";

import Link from "next/link";
import { site, heroPhotos } from "@/lib/data/site";
import Flag from "@/components/Flag";
import SmartImage from "@/components/SmartImage";
import HeroSearch from "@/components/home/HeroSearch";
import Globe3D from "@/components/Globe3D";
import { MessageCircle, PlaneTakeoff } from "lucide-react";
import type { Destination } from "@/lib/data/destinations";

const pins = [
  { code: "CY", color: "#0284C7", label: "Cyprus", x: "58%", y: "10%", cls: "animate-float" },
  { code: "AL", color: "#B91C1C", label: "Albania", x: "84%", y: "38%", cls: "animate-float-slow" },
  { code: "MY", color: "#15803D", label: "Malaysia", x: "70%", y: "78%", cls: "animate-float" },
  { code: "KH", color: "#166534", label: "Cambodia", x: "20%", y: "82%", cls: "animate-float-slow" },
  { code: "TH", color: "#CA8A04", label: "Thailand", x: "12%", y: "32%", cls: "animate-float" },
  { code: "RU", color: "#0891B2", label: "Russia", x: "38%", y: "2%", cls: "animate-float-slow" },
];

export default function Hero({ destinations, whatsapp }: { destinations: Destination[]; whatsapp: string }) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-ink-soft">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-study" />
            Study. Work. Succeed Anywhere.
          </span>

          <p className="mt-5 font-script text-3xl leading-none text-study sm:text-4xl">
            Your Passport to
          </p>
          <h1 className="mt-1 font-display text-[clamp(2.6rem,1.6rem+5vw,4.4rem)] font-extrabold leading-[1.02] text-ink">
            <span className="block animate-[heroRise_0.8s_cubic-bezier(0.22,1,0.36,1)_0.15s_both]">
              The World
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            {site.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/destinations/"
              className="group rounded-full bg-study px-7 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-study-deep"
            >
              Explore Destinations
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-7 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-95"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" /> Talk to an Advisor
            </a>
          </div>

          <div className="mt-10">
            <HeroSearch destinations={destinations} />
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
              className={`pointer-events-none absolute z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-sm ${p.cls}`}
              style={{ left: p.x, top: p.y }}
            >
              <Flag code={p.code} color={p.color} /> {p.label}
            </span>
          ))}

          <span className="pointer-events-none absolute bottom-[6%] left-[2%] flex items-center gap-1.5 rounded-full bg-hot px-3 py-1.5 text-xs font-bold text-white animate-float">
            <PlaneTakeoff className="h-3.5 w-3.5" aria-hidden="true" /> Lagos
          </span>

          {/* floating photo cards, mockup-style */}
          <div className="pointer-events-none absolute right-[-4%] top-[26%] w-28 animate-float-slow overflow-hidden rounded-2xl border-4 border-white shadow-lg sm:w-32">
            <SmartImage src={heroPhotos.graduate} alt="Graduate abroad" className="aspect-[3/4] w-full object-cover" />
          </div>
          <div className="pointer-events-none absolute bottom-[-2%] right-[14%] w-32 animate-float overflow-hidden rounded-2xl border-4 border-white shadow-lg sm:w-36">
            <SmartImage src={heroPhotos.city} alt="Destination city" className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
