import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { rowToApi, documentRowToApi, APPLICATION_STATUSES, type ApplicationRow, type ApplicationDocumentRow } from "../_applications";

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const id = String(params.id);
  const row = await env.DB.prepare(`SELECT * FROM applications WHERE id = ?`).bind(id).first<ApplicationRow>();
  if (!row) return json({ error: "Not found" }, 404);

  const { results: docs } = await env.DB.prepare(
    `SELECT * FROM application_documents WHERE application_id = ? ORDER BY created_at`
  )
    .bind(id)
    .all<ApplicationDocumentRow>();

  return json({ application: rowToApi(row), documents: docs.map(documentRowToApi) });
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const id = String(params.id);
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  if (!body.status || !(APPLICATION_STATUSES as readonly string[]).includes(body.status)) {
    return json({ error: `Status must be one of: ${APPLICATION_STATUSES.join(", ")}` }, 400);
  }

  const result = await env.DB.prepare(`UPDATE applications SET status = ? WHERE id = ?`).bind(body.status, id).run();
  if (!result.meta.changes) return json({ error: "Not found" }, 404);

  const row = await env.DB.prepare(`SELECT * FROM applications WHERE id = ?`).bind(id).first<ApplicationRow>();
  return json({ application: row ? rowToApi(row) : null });
};
