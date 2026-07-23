"use client";

// React Bits-inspired "SplitText": staggers words (or characters) into view
// with a rise + blur-off as the element scrolls in. Pure CSS transitions —
// no GSAP needed for this one, which keeps it cheap enough to use on every
// section heading.
import { createElement, useEffect, useMemo, useRef, useState, type ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  per?: "word" | "char";
  className?: string;
  /** ms between each unit */
  stagger?: number;
  /** ms before the first unit starts */
  delay?: number;
  /** extra classes applied to each animated unit (e.g. a color-cycle class) */
  unitClassName?: string;
};

export default function SplitTextReveal({
  text,
  as = "span",
  per = "word",
  className = "",
  stagger = 55,
  delay = 0,
  unitClassName = "",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  const units = useMemo(() => (per === "word" ? text.split(" ") : Array.from(text)), [text, per]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    { ref, className },
    units.flatMap((u, i) => {
      const unit = (
        <span
          key={`${u}-${i}`}
          className={`inline-block will-change-transform ${unitClassName}`}
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "none" : "translateY(0.7em) rotate(4deg) scale(0.9)",
            filter: shown ? "none" : "blur(6px)",
            transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${delay + i * stagger}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay + i * stagger}ms, filter 0.55s ease ${delay + i * stagger}ms`,
            whiteSpace: u === " " ? "pre" : undefined,
          }}
        >
          {u === " " ? " " : u}
        </span>
      );
      // keep real spaces between words as plain text nodes so lines can wrap
      return per === "word" && i < units.length - 1 ? [unit, " "] : [unit];
    })
  );
}
