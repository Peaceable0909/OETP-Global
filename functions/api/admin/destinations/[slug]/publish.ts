import { json, type Env } from "../../../types";
import { requireAdmin } from "../../_auth";

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const result = await env.DB.prepare(
    `UPDATE countries SET status = 'published', updated_at = datetime('now') WHERE slug = ?`
  )
    .bind(slug)
    .run();

  if (!result.meta.changes) return json({ error: "Not found" }, 404);

  let deployTriggered = false;
  let deployError: string | null = null;
  if (env.DEPLOY_HOOK_URL) {
    try {
      const res = await fetch(env.DEPLOY_HOOK_URL, { method: "POST" });
      deployTriggered = res.ok;
      if (!res.ok) deployError = `Deploy hook responded with ${res.status}`;
    } catch (e) {
      deployError = e instanceof Error ? e.message : "Deploy hook request failed";
    }
  } else {
    deployError = "No DEPLOY_HOOK_URL configured — publish saved, but the site will not rebuild automatically.";
  }

  return json({ ok: true, deployTriggered, deployError });
};
