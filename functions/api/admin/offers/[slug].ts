import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { rowToApi, validateOfferInput, bindingsForUpdate, type OfferRow, type OfferInput } from "../_offers";

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const row = await env.DB.prepare(`SELECT * FROM offers WHERE slug = ?`)
    .bind(slug)
    .first<OfferRow>();

  if (!row) return json({ error: "Not found" }, 404);
  return json({ offer: rowToApi(row) });
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const existing = await env.DB.prepare(`SELECT id FROM offers WHERE slug = ?`).bind(slug).first();
  if (!existing) return json({ error: "Not found" }, 404);

  let input: OfferInput;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  const error = validateOfferInput(input, false);
  if (error) return json({ error }, 400);

  await env.DB.prepare(
    `UPDATE offers SET
      title = ?, destination = ?, tagline = ?, badge = ?, total_spots = ?, spots_taken = ?, expires_at = ?, active = ?
     WHERE slug = ?`
  )
    .bind(...bindingsForUpdate(input), slug)
    .run();

  const row = await env.DB.prepare(`SELECT * FROM offers WHERE slug = ?`)
    .bind(slug)
    .first<OfferRow>();

  return json({ offer: row ? rowToApi(row) : null });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const result = await env.DB.prepare(`DELETE FROM offers WHERE slug = ?`).bind(slug).run();

  if (!result.meta.changes) return json({ error: "Not found" }, 404);
  return json({ ok: true });
};
