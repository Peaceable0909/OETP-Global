"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { fetchOffers, type Offer } from "@/lib/offers";
import type { Destination } from "@/lib/data/destinations";
import { useCountdown } from "@/lib/useCountdown";
import Reveal from "@/components/Reveal";
import Flag from "@/components/Flag";
import SmartImage from "@/components/SmartImage";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";

function CountdownRibbon({ expiresAt }: { expiresAt: string | null }) {
  const cd = useCountdown(expiresAt);
  if (!cd || cd.expired) return null;
  return (
    <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold tabular-nums text-white">
      Ends in {cd.days}d {String(cd.hours).padStart(2, "0")}h {String(cd.mins).padStart(2, "0")}m
    </span>
  );
}

function CountdownDigits({ expiresAt }: { expiresAt: string | null }) {
  const cd = useCountdown(expiresAt);
  if (!cd) return null;
  if (cd.expired) return <p className="text-sm font-bold text-ink-soft">Offer ended</p>;
  const cells = [
    { v: cd.days, l: "Days" },
    { v: cd.hours, l: "Hrs" },
    { v: cd.mins, l: "Min" },
    { v: cd.secs, l: "Sec" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map((c) => (
        <div key={c.l} className="rounded-xl bg-navy px-1 py-1.5 text-center text-white">
          <span className="block font-display text-base font-extrabold tabular-nums">
            {String(c.v).padStart(2, "0")}
          </span>
          <span className="block text-[9px] font-bold uppercase tracking-widest text-white/60">{c.l}</span>
        </div>
      ))}
    </div>
  );
}

const badgeColors: Record<string, string> = {
  HOT: "bg-hot text-white",
  "MOST POPULAR": "bg-study text-white",
  NEW: "bg-success text-white",
  TRENDING: "bg-scholar text-white",
};

function OfferCard({ offer, index, destinations }: { offer: Offer; index: number; destinations: Destination[] }) {
  const dest = destinations.find((d) => d.slug === offer.destination);
  const limited = offer.total_spots != null;
  const spotsLeft = limited ? Math.max(offer.total_spots! - offer.spots_taken, 0) : null;

  return (
    <Reveal
      delay={index * 90}
      className="w-[19rem] shrink-0 snap-start sm:w-[21rem]"
    >
      <article
        className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-lg ${
          limited ? "border-hot/50" : "border-line"
        }`}
      >
        <div className="relative h-40 overflow-hidden">
          <SmartImage
            src={dest?.photo ?? ""}
            alt={dest?.name ?? offer.destination}
            accent={dest?.accent}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          {offer.badge && (
            <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow ${badgeColors[offer.badge] ?? "bg-white/20 text-white"}`}>
              {offer.badge}
            </span>
          )}
          <CountdownRibbon expiresAt={offer.expires_at} />
          <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 font-display text-sm font-extrabold uppercase tracking-widest text-white drop-shadow">
            {dest && <Flag code={dest.code} color={dest.accent} />} {dest?.name}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3.5 p-5">
          <h3 className="font-display text-[15px] font-bold leading-snug">{offer.title}</h3>

          <ul className="space-y-1.5 text-[13px] font-medium text-ink-soft">
            {(dest?.highlights ?? []).slice(0, 3).map((h) => (
              <li key={h} className="flex gap-2">
                <span className="text-hot">✦</span>
                <span className="line-clamp-1">{h}</span>
              </li>
            ))}
          </ul>

          {limited && (
            <p className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-extrabold text-hot-deep">
              <Flame className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Fee waived — {spotsLeft} of {offer.total_spots} spots left
            </p>
          )}

          <p className="text-sm font-bold text-ink">From {dest?.tuitionFrom}</p>

          {limited ? (
            <div className="mt-auto space-y-3">
              <CountdownDigits expiresAt={offer.expires_at} />
              <Link
                href={`/apply/?destination=${offer.destination}`}
                className="flex items-center justify-center gap-2 rounded-full bg-hot px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-95"
              >
                Apply Now <span aria-hidden>→</span>
              </Link>
            </div>
          ) : (
            <Link
              href={`/destinations/${offer.destination}/`}
              className="mt-auto w-max rounded-full border border-line px-5 py-2 text-sm font-bold text-ink transition-colors hover:border-hot hover:text-hot"
            >
              View Details →
            </Link>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export default function HotCakes({ destinations }: { destinations: Destination[] }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOffers().then(setOffers);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section id="hot-cakes" className="relative scroll-mt-24 bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-hot-deep">
                <Flame className="h-4 w-4" aria-hidden="true" /> Hot Cakes — Limited Seats!
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl lg:text-[2.75rem]">Grab These Before They&apos;re Gone</h2>
              <p className="mt-2 text-ink-soft">Limited seats. Exclusive offers. Don&apos;t miss out.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/destinations/"
                className="rounded-full border border-line px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-surface"
              >
                View All Offers →
              </Link>
              <div className="hidden gap-2 sm:flex">
                <button
                  type="button"
                  aria-label="Scroll left"
                  onClick={() => scrollBy(-1)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:bg-surface"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll right"
                  onClick={() => scrollBy(1)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:bg-surface"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* The "conveyor": a snap-scrolling row instead of a static grid */}
      <div
        ref={trackRef}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] lg:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {offers.map((o, i) => (
          <OfferCard key={o.slug} offer={o} index={i} destinations={destinations} />
        ))}
        <div aria-hidden className="w-px shrink-0" />
      </div>
    </section>
  );
}
