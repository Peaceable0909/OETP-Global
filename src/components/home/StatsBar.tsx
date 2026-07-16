"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import { stats } from "@/lib/data/site";
import { Icon, type IconName } from "@/lib/icons";

const GAP_PX = 16; // matches gap-4 below

export default function StatsBar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const first = el.children[0] as HTMLElement | undefined;
        const step = (first?.offsetWidth ?? el.clientWidth) + GAP_PX;
        const i = Math.round(el.scrollLeft / step);
        setActive(Math.min(Math.max(i, 0), stats.length - 1));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative z-10 mx-auto -mt-12 max-w-6xl px-5 lg:px-8">
      <Reveal>
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-3xl border border-line bg-white p-6 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:p-8 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex w-[12.5rem] shrink-0 snap-center items-center gap-3 sm:w-auto sm:shrink">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-study-soft text-study" aria-hidden>
                <Icon name={s.icon as IconName} className="h-5 w-5" />
              </span>
              <div>
                <CountUp
                  end={s.value}
                  suffix={s.suffix}
                  className="font-display text-2xl font-extrabold text-ink sm:text-[1.7rem]"
                />
                <p className="text-[11px] font-semibold text-ink-soft sm:text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* pagination dots — mobile only */}
      <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
        {stats.map((s, i) => (
          <span
            key={s.label}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-study" : "w-1.5 bg-line"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
