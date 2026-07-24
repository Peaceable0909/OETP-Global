"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchOffers, fallbackOffers, type Offer } from "@/lib/offers";
import { useCountdown } from "@/lib/useCountdown";
import { formatMoney } from "@/lib/currency";
import { Icon, type IconName } from "@/lib/icons";
import { Flame } from "lucide-react";

// Perks are free-form strings with no structured icon reference — this
// heuristically matches common phrasing to a representative icon (a
// best-effort visual cue, not a precise taxonomy) and falls back to a
// generic "sparkles" icon for anything unmatched.
function perkIcon(perk: string): IconName {
  const p = perk.toLowerCase();
  if (p.includes("accommodation") || p.includes("housing") || p.includes("dorm")) return "bed";
  if (p.includes("dependant") || p.includes("dependent") || p.includes("family") || p.includes("spouse")) return "users";
  if (p.includes("work")) return "briefcase";
  if (p.includes("transfer") || p.includes("pathway") || p.includes("abroad") || p.includes("international")) return "globe";
  if (p.includes("visa")) return "shield-check";
  return "sparkles";
}

function formatDeadline(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(new Date(iso));
}

export default function FeaturedOfferBanner({ destination }: { destination: string }) {
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
  const hasPrice = offer.discounted_price != null;
  const cells = [
    { v: cd.days, l: "Days" },
    { v: cd.hours, l: "Hours" },
    { v: cd.mins, l: "Mins" },
    { v: cd.secs, l: "Secs" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-urgent p-6 text-white sm:p-8">
      <div className="relative flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-amber-300">
            <Flame className="h-4 w-4" aria-hidden="true" /> Limited Time — Only {offer.total_spots} Slots!
          </span>
          {offer.expires_at && (
            <span className="rounded-full bg-black/30 px-4 py-1.5 text-xs font-bold text-white/90">
              Apply by {formatDeadline(offer.expires_at)}
            </span>
          )}
        </div>

        <div>
          <p className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            {offer.discount_label || offer.title}
          </p>
          {offer.discount_label && <p className="mt-1 text-sm font-semibold text-white/80">{offer.title}</p>}
          {hasPrice && (
            <p className="mt-3 flex flex-wrap items-baseline gap-3">
              {offer.original_price != null && (
                <span className="text-lg text-white/60 line-through decoration-2">
                  {formatMoney(offer.original_price, offer.price_currency)}
                </span>
              )}
              <span className="font-display text-4xl font-extrabold text-amber-300">
                {formatMoney(offer.discounted_price!, offer.price_currency)}
              </span>
            </p>
          )}
        </div>

        {offer.perks?.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {offer.perks.map((perk) => (
              <div key={perk} className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-3 text-center">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-amber-300">
                  <Icon name={perkIcon(perk)} className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-bold leading-snug text-white/90">{perk}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4 border-t border-white/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{spotsLeft} spots left</span>
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
          </div>
          <div className="text-center sm:text-right">
            <Link
              href={`/apply/?destination=${destination}`}
              className="inline-block rounded-full bg-white px-7 py-3.5 font-bold text-urgent transition-transform duration-300 hover:-translate-y-0.5"
            >
              Apply Now →
            </Link>
            {offer.cta_note && <p className="mt-1.5 text-[11px] font-semibold text-white/70">{offer.cta_note}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
