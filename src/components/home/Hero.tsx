"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { site, heroPhotos } from "@/lib/data/site";
import Flag from "@/components/Flag";
import SmartImage from "@/components/SmartImage";
import HeroSearch from "@/components/home/HeroSearch";
import Magnetic from "@/components/Magnetic";
import SplitTextReveal from "@/components/reactbits/SplitTextReveal";
import { MessageCircle, PlaneTakeoff } from "lucide-react";
import type { Destination } from "@/lib/data/destinations";

// Three.js/R3F is the single heaviest chunk on the homepage (~285KB) — split
// it out of the main bundle so it downloads after the page is interactive
// instead of blocking it. Loading state matches Globe3D's own pre-mount
// placeholder so there's no visual jump once the real chunk arrives.
const Globe3D = dynamic(() => import("@/components/Globe3D"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center" aria-hidden="true">
      <div className="h-[70%] w-[70%] animate-pulse rounded-full bg-surface" />
    </div>
  ),
});

const pins = [
  { code: "CY", color: "#0284C7", label: "Cyprus", x: "58%", y: "10%", cls: "animate-float" },
  { code: "AL", color: "#B91C1C", label: "Albania", x: "84%", y: "38%", cls: "animate-float-slow" },
  { code: "MY", color: "#15803D", label: "Malaysia", x: "70%", y: "78%", cls: "animate-float" },
  { code: "KH", color: "#166534", label: "Cambodia", x: "20%", y: "82%", cls: "animate-float-slow" },
  { code: "TH", color: "#CA8A04", label: "Thailand", x: "12%", y: "32%", cls: "animate-float" },
  { code: "RU", color: "#0891B2", label: "Russia", x: "38%", y: "2%", cls: "animate-float-slow" },
];

export default function Hero({ destinations, whatsapp }: { destinations: Destination[]; whatsapp: string }) {
  // The plane sits parked beside the globe and only takes off when the user
  // drags the globe roughly top-left -> bottom-right (a diagonal, not just
  // any rotate) — everything else about the globe's rotation is untouched,
  // this is a plain sibling overlay watching the same pointer events.
  const [flying, setFlying] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  // The globe's chunk is ~285KB — code-splitting it alone doesn't stop the
  // browser from fetching it immediately, since it renders on first paint
  // like everything else above the fold. Waiting for the page's own `load`
  // event means the rest of the page (text, buttons, images) gets full
  // bandwidth/parse priority first, and the globe's chunk starts only once
  // that's done — same placeholder either way, so there's no visible change
  // beyond the globe animating in a beat later.
  const [globeReady, setGlobeReady] = useState(false);
  useEffect(() => {
    if (document.readyState === "complete") {
      setGlobeReady(true);
      return;
    }
    const onLoad = () => setGlobeReady(true);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const onGlobePointerDown = (e: React.PointerEvent) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  const onGlobePointerUp = (e: React.PointerEvent) => {
    const start = dragStart.current;
    dragStart.current = null;
    if (!start || flying) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.hypot(dx, dy) < 40) return; // too small to count as a swipe
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // 0=right, 90=down
    if (angle > 20 && angle < 70) setFlying(true); // roughly top-left -> bottom-right
  };

  // onAnimationEnd normally resets this, but it's not guaranteed to fire in
  // every browser/backgrounded-tab edge case — a timeout backstop means a
  // missed event can't permanently ground the plane.
  useEffect(() => {
    if (!flying) return;
    const t = setTimeout(() => setFlying(false), 950);
    return () => clearTimeout(t);
  }, [flying]);

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
            <SplitTextReveal
              text="The World"
              per="char"
              stagger={60}
              delay={150}
              className="block"
              unitClassName="text-accent-cycle"
            />
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            {site.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link
                href="/destinations/"
                className="btn-sheen group inline-block rounded-full bg-study px-7 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-study-deep"
              >
                Explore Destinations
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sheen inline-flex items-center gap-2 rounded-full bg-whatsapp px-7 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-95"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" /> Talk to an Advisor
              </a>
            </Magnetic>
          </div>

          <div className="mt-10">
            <HeroSearch destinations={destinations} />
          </div>
        </div>

        {/* 3D interactive globe + flight-path pins */}
        <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
          <div className="absolute inset-0" onPointerDown={onGlobePointerDown} onPointerUp={onGlobePointerUp}>
            {globeReady ? (
              <Globe3D />
            ) : (
              <div className="grid h-full w-full place-items-center" aria-hidden="true">
                <div className="h-[70%] w-[70%] animate-pulse rounded-full bg-surface" />
              </div>
            )}
          </div>

          {/* parked beside the globe — only takes off on a top-left to
              bottom-right drag, otherwise it just sits still */}
          <span
            aria-hidden="true"
            onAnimationEnd={() => setFlying(false)}
            className={`pointer-events-none absolute z-10 grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-hot shadow-sm ${
              flying ? "animate-plane-fly" : ""
            }`}
            style={{ left: "-5%", top: "56%" }}
          >
            <PlaneTakeoff className="h-4 w-4" aria-hidden="true" />
          </span>

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
