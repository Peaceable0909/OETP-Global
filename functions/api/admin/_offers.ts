export type OfferRow = {
  id: number;
  slug: string;
  title: string;
  destination: string;
  tagline: string | null;
  badge: string | null;
  total_spots: number | null;
  spots_taken: number;
  expires_at: string | null;
  active: number;
  created_at: string;
  discount_label: string | null;
  original_price: number | null;
  discounted_price: number | null;
  price_currency: string;
  perks: string;
  popular_programs: string;
  cta_note: string | null;
};

function parseArray<T>(text: string | null): T[] {
  if (!text) return [];
  try {
    const v = JSON.parse(text);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function rowToApi(row: OfferRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    destination: row.destination,
    tagline: row.tagline ?? "",
    badge: row.badge ?? "",
    totalSpots: row.total_spots,
    spotsTaken: row.spots_taken,
    expiresAt: row.expires_at ?? "",
    active: !!row.active,
    createdAt: row.created_at,
    discountLabel: row.discount_label ?? "",
    originalPrice: row.original_price,
    discountedPrice: row.discounted_price,
    priceCurrency: row.price_currency || "USD",
    perks: parseArray<string>(row.perks),
    popularPrograms: parseArray<string>(row.popular_programs),
    ctaNote: row.cta_note ?? "",
  };
}

export type OfferInput = {
  slug: string;
  title: string;
  destination: string;
  tagline?: string;
  badge?: string;
  totalSpots?: number | null;
  spotsTaken?: number;
  expiresAt?: string;
  active?: boolean;
  discountLabel?: string;
  originalPrice?: number | null;
  discountedPrice?: number | null;
  priceCurrency?: string;
  perks?: string[];
  popularPrograms?: string[];
  ctaNote?: string;
};

const SLUG_RE = /^[a-z0-9-]+$/;

export function validateOfferInput(input: Partial<OfferInput>, requireSlug: boolean): string | null {
  if (requireSlug) {
    if (!input.slug || !SLUG_RE.test(input.slug)) {
      return "Slug is required and must be lowercase letters, numbers and hyphens only.";
    }
  }
  if (!input.title || !input.title.trim()) return "Title is required.";
  if (!input.destination || !input.destination.trim()) return "Destination is required.";
  return null;
}

export function bindingsForInsert(input: OfferInput) {
  return [
    input.slug,
    input.title,
    input.destination,
    input.tagline || null,
    input.badge || null,
    input.totalSpots ?? null,
    input.spotsTaken ?? 0,
    input.expiresAt || null,
    input.active === false ? 0 : 1,
    input.discountLabel || null,
    input.originalPrice ?? null,
    input.discountedPrice ?? null,
    input.priceCurrency || "USD",
    JSON.stringify(input.perks || []),
    JSON.stringify(input.popularPrograms || []),
    input.ctaNote || null,
  ];
}

export function bindingsForUpdate(input: OfferInput) {
  return [
    input.title,
    input.destination,
    input.tagline || null,
    input.badge || null,
    input.totalSpots ?? null,
    input.spotsTaken ?? 0,
    input.expiresAt || null,
    input.active === false ? 0 : 1,
    input.discountLabel || null,
    input.originalPrice ?? null,
    input.discountedPrice ?? null,
    input.priceCurrency || "USD",
    JSON.stringify(input.perks || []),
    JSON.stringify(input.popularPrograms || []),
    input.ctaNote || null,
  ];
}
