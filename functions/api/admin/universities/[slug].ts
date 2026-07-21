import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { rowToApi, validateUniversityInput, bindingsForUpdate, type UniversityRow, type UniversityInput } from "../_universities";

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const row = await env.DB.prepare(`SELECT * FROM universities WHERE slug = ?`).bind(slug).first<UniversityRow>();

  if (!row) return json({ error: "Not found" }, 404);
  return json({ university: rowToApi(row) });
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const existing = await env.DB.prepare(`SELECT id FROM universities WHERE slug = ?`).bind(slug).first();
  if (!existing) return json({ error: "Not found" }, 404);

  let input: UniversityInput;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  const error = validateUniversityInput(input, false);
  if (error) return json({ error }, 400);

  await env.DB.prepare(
    `UPDATE universities SET
      country_slug = ?, name = ?, city = ?, tagline = ?, description = ?, hero_photo = ?, ranking_national = ?,
      ranking_world = ?, founded_year = ?, student_population = ?, international_student_pct = ?,
      campus_type = ?, gallery = ?, video_url = ?, accreditations = ?, accommodation_summary = ?,
      accommodation_cost_range = ?, student_life = ?, faqs = ?, featured = ?,
      updated_at = datetime('now')
     WHERE slug = ?`
  )
    .bind(...bindingsForUpdate(input), slug)
    .run();

  const row = await env.DB.prepare(`SELECT * FROM universities WHERE slug = ?`).bind(slug).first<UniversityRow>();

  return json({ university: row ? rowToApi(row) : null });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);

  const programCount = await env.DB.prepare(`SELECT COUNT(*) as n FROM programs WHERE university_slug = ?`)
    .bind(slug)
    .first<{ n: number }>();
  if (programCount && programCount.n > 0) {
    return json({ error: `Can't delete — ${programCount.n} program(s) still belong to this university. Delete those first.` }, 409);
  }

  const result = await env.DB.prepare(`DELETE FROM universities WHERE slug = ?`).bind(slug).run();

  if (!result.meta.changes) return json({ error: "Not found" }, 404);
  return json({ ok: true });
};
