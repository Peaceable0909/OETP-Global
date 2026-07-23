import { json, type Env } from "./types";

type OfferRow = {
  slug: string;
  title: string;
  destination: string;
  tagline: string | null;
  badge: string | null;
  total_spots: number | null;
  spots_taken: number;
  expires_at: string | null;
  active: number;
  discount_label: string | null;
  original_price: number | null;
  discounted_price: number | null;
  price_currency: string;
  perks: string;
  popular_programs: string;
  cta_note: string | null;
};

function parseArray(text: string): string[] {
  try {
    const v = JSON.parse(text);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    `SELECT slug, title, destination, tagline, badge, total_spots, spots_taken, expires_at, active,
            discount_label, original_price, discounted_price, price_currency, perks, popular_programs, cta_note
     FROM offers
     WHERE active = 1 AND (expires_at IS NULL OR expires_at > datetime('now'))
     ORDER BY id`
  ).all<OfferRow>();

  const offers = results.map((row) => ({
    ...row,
    perks: parseArray(row.perks),
    popular_programs: parseArray(row.popular_programs),
  }));

  return json({ offers });
};
