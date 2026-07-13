import { json, type Env } from "./types";

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

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
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
    await env.DOCS.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
    });
    await env.DB.prepare(
      `INSERT INTO application_documents (application_id, doc_type, filename, r2_key, size_bytes)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(id, docType, file.name, key, file.size)
      .run();
    uploaded.push(docType);
  }

  // Reserve a hot-cake spot when the application targets an offer with limited spots
  if (destination === "albania") {
    await env.DB.prepare(
      `UPDATE offers SET spots_taken = MIN(spots_taken + 1, COALESCE(total_spots, spots_taken + 1))
       WHERE slug = 'albania-culinary-waiver' AND active = 1`
    ).run();
  }

  return json({ id, uploaded, skipped });
};
