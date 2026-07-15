"use client";

// React Bits "ScrollStack", adapted for this site: cards pin under the navbar
// as you scroll and each new card slides over the previous one, which gently
// recedes (scale + fade). Implemented with CSS sticky + GSAP ScrollTrigger
// instead of a Lenis-hijacked scroller so native scrolling, anchors, and the
// sticky tab nav keep working.
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollStackItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`scroll-stack-card ${className}`.trim()}>{children}</div>;
}

export default function ScrollStack({
  children,
  className = "",
  /** px from the viewport top where the first card pins */
  topOffset = 130,
  /** additional px each subsequent card pins below the previous one */
  peek = 14,
  /** vertical distance between cards before they stack */
  gap = 40,
}: {
  children: ReactNode;
  className?: string;
  topOffset?: number;
  peek?: number;
  gap?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cards = gsap.utils.toArray<HTMLElement>(".scroll-stack-card", ref.current);
      cards.forEach((card, i) => {
        const top = topOffset + i * peek;
        card.style.position = "sticky";
        card.style.top = `${top}px`;
        card.style.zIndex = String(i + 1);

        const next = cards[i + 1];
        if (!next) return;
        // as the next card travels up to its pin point, this one recedes
        gsap.to(card, {
          scale: 0.94,
          opacity: 0.55,
          transformOrigin: "center top",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: `top ${top + 60}px`,
            scrub: true,
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className} style={{ display: "grid", rowGap: gap }}>
      {children}
    </div>
  );
}
