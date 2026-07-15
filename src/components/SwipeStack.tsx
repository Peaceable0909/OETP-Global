"use client";

// OriginKit-inspired "Swipe Stack": a 3D deck of cards for mobile. The top
// card follows your finger with a tilt, flies away past a threshold, and
// tucks back under the deck. Cards behind sit deeper in 3D space. The deck
// gently auto-advances until the first touch. Vertical page scrolling stays
// native (touch-action: pan-y); taps still click links — only real drags are
// swallowed.
import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const SWIPE_THRESHOLD = 80;

export default function SwipeStack({
  children,
  className = "",
  /** how many cards are visible behind the top one */
  depth = 2,
  /** ms between auto-swipes before the user first touches the deck; 0 disables */
  autoAdvance = 5000,
}: {
  children: ReactNode;
  className?: string;
  depth?: number;
  autoAdvance?: number;
}) {
  const items = useMemo(() => Children.toArray(children), [children]);
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i));
  const [drag, setDrag] = useState({ dx: 0, dy: 0, active: false });
  const [leaving, setLeaving] = useState<{ item: number; dir: 1 | -1 } | null>(null);
  const [touched, setTouched] = useState(false);
  const startRef = useRef({ x: 0, y: 0, id: -1 });
  const draggedRef = useRef(false);
  const orderRef = useRef(order);
  orderRef.current = order;

  useEffect(() => {
    setOrder(items.map((_, i) => i));
  }, [items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const swipe = useCallback((dir: 1 | -1) => {
    const cur = orderRef.current;
    if (cur.length < 2) return;
    setLeaving({ item: cur[0], dir });
  }, []);

  // once the leaving card has flown out, tuck it under the deck
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => {
      setOrder((cur) => (cur[0] === leaving.item ? [...cur.slice(1), cur[0]] : cur));
      setLeaving(null);
    }, 380);
    return () => clearTimeout(t);
  }, [leaving]);

  // gentle auto-swipe until the user takes over
  useEffect(() => {
    if (!autoAdvance || touched || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let dir: 1 | -1 = -1;
    const id = setInterval(() => {
      swipe(dir);
      dir = dir === 1 ? -1 : 1;
    }, autoAdvance);
    return () => clearInterval(id);
  }, [autoAdvance, touched, items.length, swipe]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (leaving) return;
    setTouched(true);
    draggedRef.current = false;
    startRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    // keep receiving move events even when the finger outruns the card
    // (capture can throw if the pointer is already gone — non-fatal)
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setDrag({ dx: 0, dy: 0, active: true });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.active || e.pointerId !== startRef.current.id) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (Math.abs(dx) > 8) draggedRef.current = true;
    setDrag({ dx, dy, active: true });
  };

  const endDrag = () => {
    if (!drag.active) return;
    if (Math.abs(drag.dx) > SWIPE_THRESHOLD) {
      swipe(drag.dx > 0 ? 1 : -1);
    }
    setDrag({ dx: 0, dy: 0, active: false });
  };

  // a drag must not fire the link inside the card
  const onClickCapture = (e: React.MouseEvent) => {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const dots = order.length > 1 ? items.map((_, i) => i) : [];

  return (
    <div className={className}>
      <div className="relative" style={{ perspective: "1200px", touchAction: "pan-y" }}>
        <div className="grid">
          {order.map((item, pos) => {
            if (pos > depth + 1) return null;
            const isTop = pos === 0;
            const isLeaving = leaving?.item === item;

            let transform: string;
            let transition: string;
            let opacity = 1;

            if (isLeaving) {
              transform = `translate3d(${leaving!.dir * 120}%, ${drag.dy * 0.2 - 30}px, 0) rotate(${leaving!.dir * 22}deg)`;
              transition = "transform 0.38s cubic-bezier(0.32,0.72,0.35,1), opacity 0.38s ease";
              opacity = 0;
            } else if (isTop) {
              transform = `translate3d(${drag.dx}px, ${drag.dy * 0.12}px, 0) rotate(${drag.dx / 16}deg)`;
              transition = drag.active ? "none" : "transform 0.45s cubic-bezier(0.22,1.4,0.36,1)";
            } else {
              // the deck behind: deeper in 3D, alternating lean
              const p = isLeaving ? pos : leaving ? pos - 1 : pos;
              const lean = p % 2 === 1 ? 2.2 : -1.6;
              transform = `translate3d(0, ${p * 13}px, ${p * -46}px) rotate(${p === 0 ? 0 : lean}deg)`;
              transition = "transform 0.45s cubic-bezier(0.22,1,0.36,1)";
              opacity = pos > depth ? 0 : 1;
            }

            return (
              <div
                key={`card-${item}`}
                className="[grid-area:1/1]"
                style={{
                  transform,
                  transition,
                  opacity,
                  zIndex: order.length - pos,
                  transformStyle: "preserve-3d",
                  pointerEvents: isTop && !leaving ? "auto" : "none",
                }}
                onPointerDown={isTop ? onPointerDown : undefined}
                onPointerMove={isTop ? onPointerMove : undefined}
                onPointerUp={isTop ? endDrag : undefined}
                onPointerCancel={isTop ? endDrag : undefined}
                onPointerLeave={isTop ? endDrag : undefined}
                onClickCapture={isTop ? onClickCapture : undefined}
              >
                {items[item]}
              </div>
            );
          })}
        </div>
      </div>

      {dots.length > 0 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {dots.map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === order[0] ? "w-6 bg-study" : "w-1.5 bg-line"
              }`}
            />
          ))}
          {!touched && (
            <span className="ml-3 inline-flex animate-pulse-soft items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-ink-mute">
              <span aria-hidden>←</span> Swipe <span aria-hidden>→</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
