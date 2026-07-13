import { json, type Env } from "../types";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { slug?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return json({ error: "Invalid slug" }, 400);
  }

  await env.DB.prepare(
    `INSERT INTO destination_views (slug, views, last_viewed_at) VALUES (?, 1, datetime('now'))
     ON CONFLICT(slug) DO UPDATE SET views = views + 1, last_viewed_at = datetime('now')`
  )
    .bind(slug)
    .run();

  return json({ ok: true });
};
