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
    <div ref={ref} className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      {ready && (
        <Strands
          colors={["#2563EB", "#EA580C", "#16A34A"]}
          count={3}
          speed={0.35}
          amplitude={0.55}
          waviness={1.1}
          thickness={0.14}
          glow={1.7}
          taper={2.4}
          spread={2.1}
          intensity={0.32}
          saturation={1.05}
          opacity={0.4}
          scale={2.3}
        />
      )}
    </div>
  );
}
