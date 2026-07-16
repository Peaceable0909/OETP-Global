export type Offer = {
  slug: string;
  title: string;
  destination: string;
  tagline: string;
  badge: string | null;
  total_spots: number | null;
  spots_taken: number;
  expires_at: string | null;
  active: number;
};

// Mirrors the seed rows in the D1 `offers` table. Used when the /api/offers
// function isn't reachable (e.g. `next dev` without wrangler).
export const fallbackOffers: Offer[] = [
  {
    slug: "albania-culinary-waiver",
    title: "Albania Culinary Arts — Application Fee WAIVED",
    destination: "albania",
    tagline: "First 10 students pay €0 instead of €300. No age limit, 1-year program, work while you study.",
    badge: "MOST POPULAR",
    total_spots: 10,
    spots_taken: 3,
    expires_at: "2026-08-15T23:59:59Z",
    active: 1,
  },
  {
    slug: "cyprus-admissions-open",
    title: "Cyprus Admissions Now Open",
    destination: "cyprus",
    tagline: "Straightforward visa process, high success rate, work while you study.",
    badge: "HOT",
    total_spots: null,
    spots_taken: 0,
    expires_at: "2026-09-01T23:59:59Z",
    active: 1,
  },
  {
    slug: "malaysia-business-it",
    title: "Malaysia Business & IT Intake",
    destination: "malaysia",
    tagline: "Affordable tuition, post-study work options, English-taught programs.",
    badge: "NEW",
    total_spots: null,
    spots_taken: 0,
    expires_at: "2026-09-15T23:59:59Z",
    active: 1,
  },
  {
    slug: "cambodia-hospitality",
    title: "Cambodia Hospitality Management",
    destination: "cambodia",
    tagline: "Fast admissions, clear pathway, English-taught.",
    badge: "TRENDING",
    total_spots: null,
    spots_taken: 0,
    expires_at: "2026-09-30T23:59:59Z",
    active: 1,
  },
];

// WaiverBanner, HotTicker, and HotCakes each call fetchOffers() independently
// and commonly co-exist on the same page — cache the in-flight/resolved
// request at module scope so they share one network call instead of firing
// one each.
let offersPromise: Promise<Offer[]> | null = null;

export function fetchOffers(): Promise<Offer[]> {
  if (!offersPromise) {
    offersPromise = fetch("/api/offers", { headers: { accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`offers api ${res.status}`);
        return res.json() as Promise<{ offers: Offer[] }>;
      })
      .then((data) => {
        if (!Array.isArray(data.offers) || data.offers.length === 0) throw new Error("empty");
        return data.offers;
      })
      .catch(() => fallbackOffers);
  }
  return offersPromise;
}
