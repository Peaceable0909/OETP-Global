"use client";

// React Bits "Cubes" (inspired by Can Tastemel's work for the lambda.ai
// landing page), ported to TypeScript and themed to the site palette:
// a grid of 3D cubes that tilt toward the pointer and ripple on click.
import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import "./Cubes.css";

export type CubesProps = {
  gridSize?: number;
  maxAngle?: number;
  radius?: number;
  borderStyle?: string;
  faceColor?: string;
  rippleColor?: string;
  rippleSpeed?: number;
  autoAnimate?: boolean;
  rippleOnClick?: boolean;
  className?: string;
};

export default function Cubes({
  gridSize = 8,
  maxAngle = 50,
  radius = 3,
  borderStyle = "1px solid rgba(255,255,255,0.16)",
  faceColor = "#111827",
  rippleColor = "#ea580c",
  rippleSpeed = 2,
  autoAnimate = true,
  rippleOnClick = true,
  className = "",
}: CubesProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userActiveRef = useRef(false);
  const simPosRef = useRef({ x: 0, y: 0 });
  const simTargetRef = useRef({ x: 0, y: 0 });
  const simRAFRef = useRef<number | null>(null);

  const tiltAt = useCallback(
    (rowCenter: number, colCenter: number) => {
      if (!sceneRef.current) return;
      sceneRef.current.querySelectorAll<HTMLElement>(".cube").forEach((cube) => {
        const r = Number(cube.dataset.row);
        const c = Number(cube.dataset.col);
        const dist = Math.hypot(r - rowCenter, c - colCenter);
        if (dist <= radius) {
          const pct = 1 - dist / radius;
          const angle = pct * maxAngle;
          cube.dataset.on = "1";
          gsap.to(cube, { duration: 0.3, ease: "power3.out", overwrite: true, rotateX: -angle, rotateY: angle });
        } else if (cube.dataset.on === "1") {
          // only reset cubes that were actually tilted — skipping the rest
          // keeps the per-frame tween count tiny
          cube.dataset.on = "0";
          gsap.to(cube, { duration: 0.6, ease: "power3.out", overwrite: true, rotateX: 0, rotateY: 0 });
        }
      });
    },
    [radius, maxAngle]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!sceneRef.current) return;
      userActiveRef.current = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      const rect = sceneRef.current.getBoundingClientRect();
      const colCenter = ((e.clientX - rect.left) / rect.width) * gridSize;
      const rowCenter = ((e.clientY - rect.top) / rect.height) * gridSize;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => tiltAt(rowCenter, colCenter));

      idleTimerRef.current = setTimeout(() => {
        userActiveRef.current = false;
      }, 3000);
    },
    [gridSize, tiltAt]
  );

  const resetAll = useCallback(() => {
    if (!sceneRef.current) return;
    sceneRef.current
      .querySelectorAll<HTMLElement>(".cube")
      .forEach((cube) => gsap.to(cube, { duration: 0.6, rotateX: 0, rotateY: 0, ease: "power3.out" }));
  }, []);

  const onClick = useCallback(
    (e: MouseEvent) => {
      if (!rippleOnClick || !sceneRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      const colHit = Math.floor(((e.clientX - rect.left) / rect.width) * gridSize);
      const rowHit = Math.floor(((e.clientY - rect.top) / rect.height) * gridSize);

      const spreadDelay = 0.15 / rippleSpeed;
      const animDuration = 0.3 / rippleSpeed;
      const holdTime = 0.6 / rippleSpeed;

      const rings: Record<number, HTMLElement[]> = {};
      sceneRef.current.querySelectorAll<HTMLElement>(".cube").forEach((cube) => {
        const r = Number(cube.dataset.row);
        const c = Number(cube.dataset.col);
        const ring = Math.round(Math.hypot(r - rowHit, c - colHit));
        (rings[ring] ??= []).push(cube);
      });

      Object.keys(rings)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((ring) => {
          const delay = ring * spreadDelay;
          const faces = rings[ring].flatMap((cube) => Array.from(cube.querySelectorAll<HTMLElement>(".cube-face")));
          gsap.to(faces, { backgroundColor: rippleColor, duration: animDuration, delay, ease: "power3.out" });
          gsap.to(faces, {
            backgroundColor: faceColor,
            duration: animDuration,
            delay: delay + animDuration + holdTime,
            ease: "power3.out",
          });
        });
    },
    [rippleOnClick, gridSize, faceColor, rippleColor, rippleSpeed]
  );

  useEffect(() => {
    if (!autoAnimate || !sceneRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    simPosRef.current = { x: Math.random() * gridSize, y: Math.random() * gridSize };
    simTargetRef.current = { x: Math.random() * gridSize, y: Math.random() * gridSize };
    const speed = 0.02;
    let frame = 0;
    const loop = () => {
      // idle-animate only while on screen, every 3rd frame — the tweens
      // (0.3–0.6s) smooth over the lower update rate
      if (!userActiveRef.current && inViewRef.current && ++frame % 3 === 0) {
        const pos = simPosRef.current;
        const tgt = simTargetRef.current;
        pos.x += (tgt.x - pos.x) * speed;
        pos.y += (tgt.y - pos.y) * speed;
        tiltAt(pos.y, pos.x);
        if (Math.hypot(pos.x - tgt.x, pos.y - tgt.y) < 0.1) {
          simTargetRef.current = { x: Math.random() * gridSize, y: Math.random() * gridSize };
        }
      }
      simRAFRef.current = requestAnimationFrame(loop);
    };
    simRAFRef.current = requestAnimationFrame(loop);
    return () => {
      if (simRAFRef.current != null) cancelAnimationFrame(simRAFRef.current);
    };
  }, [autoAnimate, gridSize, tiltAt]);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
    });
    io.observe(el);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", resetAll);
    el.addEventListener("click", onClick);
    return () => {
      io.disconnect();
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", resetAll);
      el.removeEventListener("click", onClick);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [onPointerMove, resetAll, onClick]);

  const cells = Array.from({ length: gridSize });
  return (
    <div
      className={`cubes-wrap ${className}`.trim()}
      style={
        {
          "--cube-face-border": borderStyle,
          "--cube-face-bg": faceColor,
        } as React.CSSProperties
      }
    >
      <div
        ref={sceneRef}
        className="cubes-scene"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {cells.map((_, r) =>
          cells.map((__, c) => (
            <div key={`${r}-${c}`} className="cube" data-row={r} data-col={c}>
              <div className="cube-face cube-face--top" />
              <div className="cube-face cube-face--bottom" />
              <div className="cube-face cube-face--left" />
              <div className="cube-face cube-face--right" />
              <div className="cube-face cube-face--front" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
