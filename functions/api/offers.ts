import { json, type Env } from "./types";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    `SELECT slug, title, destination, tagline, badge, total_spots, spots_taken, expires_at, active
     FROM offers
     WHERE active = 1 AND (expires_at IS NULL OR expires_at > datetime('now'))
     ORDER BY id`
  ).all();
  return json({ offers: results });
};
