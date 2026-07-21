import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { rowToApi, documentRowToApi, APPLICATION_STATUSES, type ApplicationRow, type ApplicationDocumentRow } from "../_applications";
import { sendEmail, statusUpdateEmail } from "../../_email";

const DEFAULT_WHATSAPP = "https://wa.me/2340000000000";

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

  const before = await env.DB.prepare(`SELECT * FROM applications WHERE id = ?`).bind(id).first<ApplicationRow>();
  if (!before) return json({ error: "Not found" }, 404);

  await env.DB.prepare(`UPDATE applications SET status = ? WHERE id = ?`).bind(body.status, id).run();

  const row = await env.DB.prepare(`SELECT * FROM applications WHERE id = ?`).bind(id).first<ApplicationRow>();

  let emailSent = false;
  let emailError: string | null = null;
  // D1's meta.changes counts a matched row even when the new status equals
  // the old one — only email on a genuine change, so re-saving the same
  // status from the admin UI never spams the applicant.
  if (row && before.status !== body.status) {
    const whatsappRow = await env.DB.prepare(`SELECT value FROM settings WHERE key = 'whatsapp'`).first<{ value: string }>();
    const whatsapp = whatsappRow?.value || DEFAULT_WHATSAPP;
    const result = await sendEmail(env, {
      to: row.email,
      ...statusUpdateEmail({ id, fullName: row.full_name, status: row.status, whatsapp }),
    });
    emailSent = result.sent;
    emailError = result.error ?? null;
    if (emailSent) {
      await env.DB.prepare(`UPDATE applications SET last_status_email_at = datetime('now') WHERE id = ?`).bind(id).run();
    }
  }

  return json({ application: row ? rowToApi(row) : null, emailSent, emailError });
};
