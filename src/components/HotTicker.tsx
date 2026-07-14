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
  // duplicate so the translateX(-50%) loop is seamless
  const loop = [...items, ...items];

  return (
    <Link href="/#hot-cakes" aria-label="View hot offers" className="block overflow-hidden bg-navy text-white">
      <div className="flex w-max animate-ticker gap-12 whitespace-nowrap py-2 pr-12 text-[13px] font-semibold tracking-wide hover:[animation-play-state:paused]">
        {loop.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <Flame className="h-3.5 w-3.5 text-hot" aria-hidden="true" />
            {t}
            <span className="text-hot">•</span>
          </span>
        ))}
      </div>
    </Link>
  );
}
