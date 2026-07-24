"use client";

import { useEffect, useRef, useState } from "react";
import { formatMoney } from "@/lib/currency";

/** Counts up to `value` once it scrolls into view — same IntersectionObserver
 * + reduced-motion pattern as Reveal, just driving a number instead of opacity. */
export default function StatCounter({
  value,
  suffix = "",
  duration = 1200,
  currency,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  /** Renders through formatMoney() for a currency-symbol prefix instead of
   *  the default toLocaleString()+suffix rendering. A plain string, not a
   *  callback — this component can be reached from a Server Component tree,
   *  which can't pass functions across the client boundary. */
  currency?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{currency ? formatMoney(display, currency) : `${display.toLocaleString()}${suffix}`}</span>;
}
