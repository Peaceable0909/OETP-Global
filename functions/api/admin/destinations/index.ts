import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { rowToApi, validateCountryInput, bindingsForInsert, type CountryRow, type CountryInput } from "../_countries";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const { results } = await env.DB.prepare(
    `SELECT * FROM countries ORDER BY name`
  ).all<CountryRow>();

  return json({ countries: results.map(rowToApi) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  let input: CountryInput;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  const error = validateCountryInput(input, true);
  if (error) return json({ error }, 400);

  const existing = await env.DB.prepare(`SELECT id FROM countries WHERE slug = ?`)
    .bind(input.slug)
    .first();
  if (existing) return json({ error: "A country with this slug already exists." }, 409);

  await env.DB.prepare(
    `INSERT INTO countries (
      slug, name, code, tagline, hero_gradient, accent, photo, summary, capital, language,
      currency, intake_months, visa_processing, program_length, tuition_from, work_rights,
      featured, highlights, programs, visa_steps, requirements, documents, faqs, specializations
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(...bindingsForInsert(input))
    .run();

  const row = await env.DB.prepare(`SELECT * FROM countries WHERE slug = ?`)
    .bind(input.slug)
    .first<CountryRow>();

  return json({ country: row ? rowToApi(row) : null }, 201);
};
