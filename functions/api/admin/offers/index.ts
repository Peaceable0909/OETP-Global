import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { rowToApi, validateOfferInput, bindingsForInsert, type OfferRow, type OfferInput } from "../_offers";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const { results } = await env.DB.prepare(
    `SELECT * FROM offers ORDER BY created_at DESC`
  ).all<OfferRow>();

  return json({ offers: results.map(rowToApi) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  let input: OfferInput;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  const error = validateOfferInput(input, true);
  if (error) return json({ error }, 400);

  const existing = await env.DB.prepare(`SELECT id FROM offers WHERE slug = ?`)
    .bind(input.slug)
    .first();
  if (existing) return json({ error: "An offer with this slug already exists." }, 409);

  await env.DB.prepare(
    `INSERT INTO offers (slug, title, destination, tagline, badge, total_spots, spots_taken, expires_at, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(...bindingsForInsert(input))
    .run();

  const row = await env.DB.prepare(`SELECT * FROM offers WHERE slug = ?`)
    .bind(input.slug)
    .first<OfferRow>();

  return json({ offer: row ? rowToApi(row) : null }, 201);
};
