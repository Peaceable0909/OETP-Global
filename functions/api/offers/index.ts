import { json, type Env } from "../types";

// Field names here are snake_case on purpose — they're returned as-is to
// match src/lib/offers.ts's `Offer` type, which mirrors the D1 row shape
// directly rather than the admin panel's usual camelCase convention.
type PublicOfferRow = {
  slug: string;
  title: string;
  destination: string;
  tagline: string | null;
  badge: string | null;
  total_spots: number | null;
  spots_taken: number;
  expires_at: string | null;
  active: number;
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    `SELECT slug, title, destination, tagline, badge, total_spots, spots_taken, expires_at, active
     FROM offers
     WHERE active = 1 AND (expires_at IS NULL OR expires_at > datetime('now'))
     ORDER BY created_at DESC`
  ).all<PublicOfferRow>();

  return json({ offers: results });
};
