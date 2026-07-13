import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB per image
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_KINDS = ["country-hero", "program", "specialization"] as const;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  if (!env.IMAGES) {
    return json({ error: "Image storage is not configured on this environment yet." }, 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Expected multipart form data" }, 400);
  }

  const kindRaw = form.get("kind");
  const kind = typeof kindRaw === "string" && (ALLOWED_KINDS as readonly string[]).includes(kindRaw)
    ? kindRaw
    : "country-hero";

  const slugRaw = form.get("country_slug");
  const countrySlug = typeof slugRaw === "string" ? slugRaw.trim().slice(0, 60) : "";

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return json({ error: "No file provided" }, 400);
  }
  if (file.size > MAX_FILE_BYTES) {
    return json({ error: "File is too large (max 5MB)." }, 400);
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return json({ error: "Only JPEG, PNG, or WebP images are allowed." }, 400);
  }

  const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 100);
  const key = `${kind}/${countrySlug || "misc"}/${Date.now()}-${safeName}`;

  await env.IMAGES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  await env.DB.prepare(
    `INSERT INTO admin_images (r2_key, kind, country_slug) VALUES (?, ?, ?)`
  )
    .bind(key, kind, countrySlug || null)
    .run();

  const base = env.IMAGES_PUBLIC_BASE?.replace(/\/$/, "");
  const url = base ? `${base}/${key}` : null;

  return json({
    key,
    url,
    warning: url ? undefined : "Uploaded, but IMAGES_PUBLIC_BASE isn't configured yet — no public URL available.",
  }, 201);
};
