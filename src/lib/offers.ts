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

export async function fetchOffers(): Promise<Offer[]> {
  try {
    const res = await fetch("/api/offers", { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`offers api ${res.status}`);
    const data = (await res.json()) as { offers: Offer[] };
    if (!Array.isArray(data.offers) || data.offers.length === 0) throw new Error("empty");
    return data.offers;
  } catch {
    return fallbackOffers;
  }
}
