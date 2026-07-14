import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { rowToApi, validateTestimonialInput, bindingsForUpdate, type TestimonialRow, type TestimonialInput } from "../_testimonials";

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const row = await env.DB.prepare(`SELECT * FROM testimonials WHERE slug = ?`)
    .bind(slug)
    .first<TestimonialRow>();

  if (!row) return json({ error: "Not found" }, 404);
  return json({ testimonial: rowToApi(row) });
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const existing = await env.DB.prepare(`SELECT id FROM testimonials WHERE slug = ?`).bind(slug).first();
  if (!existing) return json({ error: "Not found" }, 404);

  let input: TestimonialInput;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  const error = validateTestimonialInput(input, false);
  if (error) return json({ error }, 400);

  await env.DB.prepare(
    `UPDATE testimonials SET
      name = ?, destination = ?, text = ?, photo = ?, featured = ?, sort_order = ?,
      updated_at = datetime('now')
     WHERE slug = ?`
  )
    .bind(...bindingsForUpdate(input), slug)
    .run();

  const row = await env.DB.prepare(`SELECT * FROM testimonials WHERE slug = ?`)
    .bind(slug)
    .first<TestimonialRow>();

  return json({ testimonial: row ? rowToApi(row) : null });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const result = await env.DB.prepare(`DELETE FROM testimonials WHERE slug = ?`).bind(slug).run();

  if (!result.meta.changes) return json({ error: "Not found" }, 404);
  return json({ ok: true });
};
