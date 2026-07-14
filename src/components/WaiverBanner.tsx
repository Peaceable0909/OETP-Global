"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchOffers, fallbackOffers, type Offer } from "@/lib/offers";
import { useCountdown } from "@/lib/useCountdown";
import { Flame } from "lucide-react";

export default function WaiverBanner({ destination }: { destination: string }) {
  const [offer, setOffer] = useState<Offer | null>(
    fallbackOffers.find((o) => o.destination === destination && o.total_spots != null) ?? null
  );

  useEffect(() => {
    fetchOffers().then((offers) => {
      const match = offers.find((o) => o.destination === destination && o.total_spots != null);
      if (match) setOffer(match);
    });
  }, [destination]);

  const cd = useCountdown(offer?.expires_at ?? null);
  if (!offer || !cd || cd.expired) return null;

  const spotsLeft = Math.max((offer.total_spots ?? 0) - offer.spots_taken, 0);
  const cells = [
    { v: cd.days, l: "Days" },
    { v: cd.hours, l: "Hours" },
    { v: cd.mins, l: "Mins" },
    { v: cd.secs, l: "Secs" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-urgent p-6 text-white sm:p-7">
      <div className="relative flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-amber-300" aria-hidden>
            <Flame className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">
              Application fee waived for first {offer.total_spots} students!
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold">
              <span className="mr-2 text-white/70 line-through decoration-hot decoration-2">€300</span>
              <span className="text-3xl text-amber-300">€0</span>
              <span className="ml-3 rounded-full bg-white/15 px-3 py-1 align-middle text-xs font-bold">
                {spotsLeft} spots left
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <div className="flex gap-2">
            {cells.map((c) => (
              <div key={c.l} className="min-w-[3.2rem] rounded-xl bg-black/30 px-2 py-2 text-center">
                <span className="block font-display text-xl font-extrabold tabular-nums">
                  {String(c.v).padStart(2, "0")}
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-white/60">{c.l}</span>
              </div>
            ))}
          </div>
          <div className="text-right">
            <p className="mb-1.5 text-[11px] font-bold text-white/80">Offer ends soon. Apply now!</p>
            <Link
              href={`/apply/?destination=${destination}`}
              className="inline-block rounded-full bg-white px-6 py-3 font-bold text-urgent transition-transform duration-300 hover:-translate-y-0.5"
            >
              Apply Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
