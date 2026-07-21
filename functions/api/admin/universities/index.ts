import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { rowToApi, validateUniversityInput, bindingsForInsert, type UniversityRow, type UniversityInput } from "../_universities";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const url = new URL(request.url);
  const countrySlug = url.searchParams.get("country");

  const { results } = countrySlug
    ? await env.DB.prepare(`SELECT * FROM universities WHERE country_slug = ? ORDER BY name`).bind(countrySlug).all<UniversityRow>()
    : await env.DB.prepare(`SELECT * FROM universities ORDER BY name`).all<UniversityRow>();

  return json({ universities: results.map(rowToApi) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  let input: UniversityInput;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  const error = validateUniversityInput(input, true);
  if (error) return json({ error }, 400);

  const existing = await env.DB.prepare(`SELECT id FROM universities WHERE slug = ?`).bind(input.slug).first();
  if (existing) return json({ error: "A university with this slug already exists." }, 409);

  await env.DB.prepare(
    `INSERT INTO universities (
      slug, country_slug, name, city, tagline, hero_photo, ranking_national, ranking_world,
      founded_year, student_population, international_student_pct, campus_type, gallery,
      video_url, accreditations, accommodation_summary, accommodation_cost_range, student_life,
      faqs, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(...bindingsForInsert(input))
    .run();

  const row = await env.DB.prepare(`SELECT * FROM universities WHERE slug = ?`).bind(input.slug).first<UniversityRow>();

  return json({ university: row ? rowToApi(row) : null }, 201);
};
