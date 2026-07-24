import { json, type Env } from "./types";
import { sendEmail, applicationConfirmationEmail, applicationStaffNotificationEmail } from "./_email";

const DEFAULT_WHATSAPP = "https://wa.me/2340000000000";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per document
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const DOC_FIELDS = ["passport", "certificate", "transcript", "cv", "other"] as const;

function makeApplicationId(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no confusable chars
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let code = "";
  for (const b of bytes) code += alphabet[b % alphabet.length];
  return `CBS-${code}`;
}

// btoa() chokes on huge strings built via String.fromCharCode(...bytes) in
// one call (call-stack blowup) — chunk it, same pattern as any other
// Workers-runtime base64 encoder.
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

type ScriptDocument = { docType: string; filename: string; mimeType: string; base64: string };

// Best-effort, never throws — the application has already been saved by the
// time this runs, so a slow/unreachable Apps Script deployment (cold start,
// quota, wrong URL) must never turn a successful submission into a 500.
// Apps Script only handles the Sheet log + Drive/PDF backup now (the one
// thing Workers can't do) — both emails go through Resend below instead.
async function backUpToAppsScript(
  env: Env,
  payload: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    destination: string;
    program: string;
    message: string;
    documents: ScriptDocument[];
  }
): Promise<{ ok: boolean; folderUrl?: string }> {
  if (!env.APPS_SCRIPT_WEBHOOK_URL || !env.APPS_SCRIPT_SHARED_SECRET) return { ok: false };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(env.APPS_SCRIPT_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret: env.APPS_SCRIPT_SHARED_SECRET, ...payload }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return { ok: false };
    const data = await res.json<{ ok: boolean; folderUrl?: string }>().catch(() => ({ ok: false }) as const);
    return { ok: !!data.ok, folderUrl: data.folderUrl };
  } catch {
    return { ok: false };
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Expected multipart form data" }, 400);
  }

  const field = (name: string) => {
    const v = form.get(name);
    return typeof v === "string" ? v.trim() : "";
  };

  const fullName = field("full_name");
  const email = field("email");
  const phone = field("phone");
  const country = field("country");
  const destination = field("destination");
  const program = field("program");
  const message = field("message");

  if (!fullName || !email || !phone || !country || !destination) {
    return json({ error: "Please fill in all required fields." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Please enter a valid email address." }, 400);
  }

  const id = makeApplicationId();

  await env.DB.prepare(
    `INSERT INTO applications (id, full_name, email, phone, country, destination, program, message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, fullName, email, phone, country, destination, program || null, message || null)
    .run();

  const uploaded: string[] = [];
  const skipped: string[] = [];
  const scriptDocuments: ScriptDocument[] = [];

  for (const docType of DOC_FIELDS) {
    const file = form.get(docType);
    if (!(file instanceof File) || file.size === 0) continue;
    if (file.size > MAX_FILE_BYTES || !ALLOWED_TYPES.includes(file.type)) {
      skipped.push(docType);
      continue;
    }
    if (!env.DOCS) {
      skipped.push(docType);
      continue;
    }
    const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 100);
    const key = `${id}/${docType}/${safeName}`;
    const bytes = await file.arrayBuffer();
    await env.DOCS.put(key, bytes, {
      httpMetadata: { contentType: file.type },
    });
    await env.DB.prepare(
      `INSERT INTO application_documents (application_id, doc_type, filename, r2_key, size_bytes)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(id, docType, file.name, key, file.size)
      .run();
    uploaded.push(docType);
    scriptDocuments.push({ docType, filename: safeName, mimeType: file.type, base64: arrayBufferToBase64(bytes) });
  }

  // Reserve a hot-cake spot when the application targets an offer with limited spots
  if (destination === "albania") {
    await env.DB.prepare(
      `UPDATE offers SET spots_taken = MIN(spots_taken + 1, COALESCE(total_spots, spots_taken + 1))
       WHERE slug = 'albania-culinary-waiver' AND active = 1`
    ).run();
  }

  const whatsappRow = await env.DB.prepare(`SELECT value FROM settings WHERE key = 'whatsapp'`).first<{ value: string }>();
  const whatsapp = whatsappRow?.value || DEFAULT_WHATSAPP;

  const emailResult = await sendEmail(env, {
    to: email,
    ...applicationConfirmationEmail({ id, fullName, whatsapp }),
  });
  if (emailResult.sent) {
    await env.DB.prepare(`UPDATE applications SET confirmation_sent_at = datetime('now') WHERE id = ?`).bind(id).run();
  }

  // Sheet log + Drive/PDF backup (google-apps-script/apply-webhook.gs) and the
  // staff notification email both involve slow, non-essential network calls
  // (Apps Script cold starts can take several seconds; the staff email
  // carries the full document attachments) — neither should make the
  // student's own request wait. Run them after the response is already on
  // its way via waitUntil, same as any other post-response side effect.
  waitUntil(
    (async () => {
      const backup = await backUpToAppsScript(env, {
        id,
        fullName,
        email,
        phone,
        country,
        destination,
        program,
        message,
        documents: scriptDocuments,
      });

      if (env.STAFF_NOTIFICATION_EMAIL) {
        await sendEmail(env, {
          to: env.STAFF_NOTIFICATION_EMAIL,
          ...applicationStaffNotificationEmail({
            id,
            fullName,
            email,
            phone,
            country,
            destination,
            program,
            message,
            documentNames: scriptDocuments.map((d) => `${d.docType}: ${d.filename}`),
            driveFolderUrl: backup.folderUrl,
          }),
          attachments: scriptDocuments.map((d) => ({ filename: d.filename, content: d.base64 })),
        });
      }
    })()
  );

  return json({
    id,
    uploaded,
    skipped,
    emailSent: emailResult.sent,
    emailError: emailResult.error ?? null,
  });
};
