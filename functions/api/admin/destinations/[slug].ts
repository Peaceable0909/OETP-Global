import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { rowToApi, validateCountryInput, bindingsForUpdate, type CountryRow, type CountryInput } from "../_countries";

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const row = await env.DB.prepare(`SELECT * FROM countries WHERE slug = ?`)
    .bind(slug)
    .first<CountryRow>();

  if (!row) return json({ error: "Not found" }, 404);
  return json({ country: rowToApi(row) });
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const existing = await env.DB.prepare(`SELECT id FROM countries WHERE slug = ?`).bind(slug).first();
  if (!existing) return json({ error: "Not found" }, 404);

  let input: CountryInput;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  const error = validateCountryInput(input, false);
  if (error) return json({ error }, 400);

  await env.DB.prepare(
    `UPDATE countries SET
      name = ?, code = ?, tagline = ?, hero_gradient = ?, accent = ?, photo = ?, summary = ?,
      capital = ?, language = ?, currency = ?, intake_months = ?, visa_processing = ?,
      program_length = ?, tuition_from = ?, work_rights = ?, featured = ?, highlights = ?,
      programs = ?, visa_steps = ?, requirements = ?, documents = ?, faqs = ?, specializations = ?,
      updated_at = datetime('now')
     WHERE slug = ?`
  )
    .bind(...bindingsForUpdate(input), slug)
    .run();

  const row = await env.DB.prepare(`SELECT * FROM countries WHERE slug = ?`)
    .bind(slug)
    .first<CountryRow>();

  return json({ country: row ? rowToApi(row) : null });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const result = await env.DB.prepare(`DELETE FROM countries WHERE slug = ?`).bind(slug).run();

  if (!result.meta.changes) return json({ error: "Not found" }, 404);
  return json({ ok: true });
};
