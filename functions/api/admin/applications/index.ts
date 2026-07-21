import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { rowToApi, type ApplicationRow } from "../_applications";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const status = new URL(request.url).searchParams.get("status");

  const { results } = status
    ? await env.DB.prepare(`SELECT * FROM applications WHERE status = ? ORDER BY created_at DESC`).bind(status).all<ApplicationRow>()
    : await env.DB.prepare(`SELECT * FROM applications ORDER BY created_at DESC`).all<ApplicationRow>();

  return json({ applications: results.map(rowToApi) });
};
