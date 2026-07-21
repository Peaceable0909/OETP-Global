import { type Env } from "../../../../types";
import { requireAdmin } from "../../../_auth";

// Application documents (passport scans, transcripts, etc.) are personal
// data — unlike the public IMAGES proxy, this route is admin-gated and
// reads from the private DOCS bucket, never exposed via a guessable public URL.
export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return new Response("Unauthorized", { status: 401 });
  if (!env.DOCS) return new Response("Document storage is not configured on this environment yet.", { status: 503 });

  const applicationId = String(params.id);
  const docId = Number(params.docId);

  const row = await env.DB.prepare(
    `SELECT r2_key, filename FROM application_documents WHERE id = ? AND application_id = ?`
  )
    .bind(docId, applicationId)
    .first<{ r2_key: string; filename: string }>();
  if (!row) return new Response("Not found", { status: 404 });

  const object = await env.DOCS.get(row.r2_key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("content-disposition", `inline; filename="${row.filename.replace(/"/g, "")}"`);

  return new Response(object.body, { headers });
};
