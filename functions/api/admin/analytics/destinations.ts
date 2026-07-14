import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const { results } = await env.DB.prepare(
    `SELECT c.slug AS slug, c.name AS name, COALESCE(v.views, 0) AS views, v.last_viewed_at AS lastViewedAt
     FROM countries c
     LEFT JOIN destination_views v ON v.slug = c.slug
     ORDER BY views DESC, c.name`
  ).all<{ slug: string; name: string; views: number; lastViewedAt: string | null }>();

  return json({ destinations: results });
};
