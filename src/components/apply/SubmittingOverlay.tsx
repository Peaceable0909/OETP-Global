"use client";

import { useEffect, useState } from "react";
import { PlaneTakeoff } from "lucide-react";

const MESSAGES = [
  "Packing your details…",
  "Uploading your documents…",
  "Reserving your spot…",
  "Preparing your Application ID…",
];

// A gentle climbing arc — the plane travels along this via CSS offset-path
// (not a plain translate/rotate pair), so offset-rotate can bank it to match
// the curve's tangent instead of it looking like it's sliding sideways.
const FLIGHT_PATH = "path('M 8 92 Q 100 78 140 40 T 232 8')";

export default function SubmittingOverlay() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 1700);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm"
    >
      <div className="mx-5 w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="relative mx-auto h-24 w-60">
          <svg viewBox="0 0 240 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path
              d="M 8 92 Q 100 78 140 40 T 232 8"
              fill="none"
              stroke="var(--color-line)"
              strokeWidth="2"
              strokeDasharray="6 8"
              className="animate-dash"
            />
          </svg>
          <span
            className="animate-fly-path absolute grid h-9 w-9 place-items-center rounded-full bg-study text-white shadow-lg"
            style={{ offsetPath: FLIGHT_PATH, offsetRotate: "auto" }}
            aria-hidden="true"
          >
            <PlaneTakeoff className="h-5 w-5" />
          </span>
        </div>

        <p className="mt-2 font-display text-lg font-extrabold text-ink transition-opacity duration-300">
          {MESSAGES[messageIndex]}
        </p>
        <p className="mt-2 text-xs font-semibold text-ink-soft">This usually takes just a few seconds.</p>
      </div>
    </div>
  );
}
