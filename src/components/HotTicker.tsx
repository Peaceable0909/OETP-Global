"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { fetchOffers, type Offer } from "@/lib/offers";

export default function HotTicker() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    fetchOffers().then(setOffers);
  }, []);

  if (offers.length === 0) return null;

  const items = offers.map((o) => {
    const spots =
      o.total_spots != null ? ` — ${Math.max(o.total_spots - o.spots_taken, 0)} spots left` : "";
    return `${o.title}${spots}`;
  });

  // No aria-label override here — the link's accessible name comes from its
  // real visible content instead, so it can never drift out of sync with
  // what's on screen (a mismatch is exactly what axe's
  // label-content-name-mismatch check exists to catch, and matters for
  // voice-control users who refer to what they see). The second copy of the
  // list exists purely so the translateX(-50%) loop is seamless — it's
  // aria-hidden so screen readers don't read every offer twice.
  return (
    <Link href="/#hot-cakes" className="block overflow-hidden bg-navy text-white">
      <div className="flex w-max animate-ticker gap-12 whitespace-nowrap py-2 pr-12 text-[13px] font-semibold tracking-wide hover:[animation-play-state:paused]">
        {items.map((t, i) => (
          <span key={`a-${i}`} className="inline-flex items-center gap-2">
            <Flame className="h-3.5 w-3.5 text-hot" aria-hidden="true" />
            {t}
            <span className="text-hot" aria-hidden="true">•</span>
          </span>
        ))}
        {items.map((t, i) => (
          <span key={`b-${i}`} aria-hidden="true" className="inline-flex items-center gap-2">
            <Flame className="h-3.5 w-3.5 text-hot" aria-hidden="true" />
            {t}
            <span className="text-hot">•</span>
          </span>
        ))}
      </div>
    </Link>
  );
}
