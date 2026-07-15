"use client";

import { useEffect, useRef, useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  /** Accent color used to tint the placeholder while the real photo hasn't been uploaded yet. */
  accent?: string;
};

/**
 * Points at a real photo path under /public/images/... When that file hasn't been
 * uploaded yet (404), it falls back to a branded placeholder instead of breaking —
 * so the site always looks intentional, and swapping in the real photo later
 * (via GitHub's "Add file -> Upload files", same exact filename) needs zero code changes.
 */
export default function SmartImage({ src, alt, accent = "#7C3AED", className = "", ...rest }: Props) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  // onError normally catches a failed load, but a plain <img> starts fetching
  // as soon as the browser parses it — before React hydrates and attaches
  // this listener. A photo that 404s in that window never fires an event we
  // can hear, and is left stuck as a native broken-image icon forever. This
  // backstop checks the actual load state directly instead of only waiting
  // for the event (same idea as the plane animation's timeout backstop).
  useEffect(() => {
    const checkFailed = () => {
      if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth === 0) {
        setFailed(true);
      }
    };
    checkFailed();
    const t = setTimeout(checkFailed, 1000);
    return () => clearTimeout(t);
  }, [src]);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_30%_20%,var(--tint)_0%,transparent_60%)] ${className}`}
        style={{ ["--tint" as string]: `${accent}33`, backgroundColor: `${accent}14` }}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 opacity-40" fill="none" stroke={accent} strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10" r="1.5" />
          <path d="M21 15l-5-5-9 9" />
        </svg>
        <span className="px-3 text-center text-[11px] font-semibold opacity-50" style={{ color: accent }}>
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
