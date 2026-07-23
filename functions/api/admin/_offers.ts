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
};

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
  ];
}
