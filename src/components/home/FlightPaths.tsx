"use client";

// Decorative flight-path light trails behind the Departures board — ties
// into the airline/journey motif (boarding pass, departures, plane icons)
// already used across this section. Deferred until the section is nearly
// in view (it sits near the bottom of the page) and skipped entirely under
// reduced-motion, same gating approach as the hero globe in Hero.tsx.
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Strands = dynamic(() => import("@/components/reactbits/Strands"), { ssr: false });

export default function FlightPaths() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 top-0 hidden h-28 -translate-y-1/2 sm:h-36 lg:block lg:h-44"
      aria-hidden="true"
    >
      {ready && (
        <Strands
          colors={["#25D366", "#229ED9", "#EA580C"]}
          count={3}
          speed={0.3}
          amplitude={0.7}
          waviness={0.7}
          thickness={0.32}
          glow={1.5}
          taper={0.9}
          spread={2.6}
          intensity={0.4}
          saturation={1.6}
          opacity={0.85}
          scale={13}
        />
      )}
    </div>
  );
}
