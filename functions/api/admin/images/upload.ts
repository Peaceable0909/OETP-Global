import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { PhotonImage, SamplingFilter, resize } from "@cf-wasm/photon/workerd";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB per image
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_KINDS = [
  "country-hero",
  "program",
  "specialization",
  "testimonial",
  "university-hero",
  "university-gallery",
] as const;

const MAX_DIMENSION = 1600; // matches the resize cap applied to the site's static photos
const JPEG_QUALITY = 80;

// The static site's own photos get resized/recompressed via a one-off sharp
// script (Node-only, a native binary — can't run in Workers). Admin uploads
// land here instead, at runtime, in the Workers/Pages Functions environment,
// so they need a WASM image lib rather than sharp. Photon (Rust, compiled to
// WASM) fills that gap — decodes, resizes to the same 1600px cap, and
// re-encodes. PNGs are kept lossless (uploads of this type are typically
// logos/graphics that may need transparency); everything else becomes JPEG.
// Never hard-fails the upload: falls back to storing the original bytes/type
// untouched if processing throws for any reason.
async function compressImage(
  bytes: Uint8Array,
  contentType: string
): Promise<{ bytes: Uint8Array; contentType: string; ext: string }> {
  const fallback = {
    bytes,
    contentType,
    ext: contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg",
  };

  let input: PhotonImage | undefined;
  let resized: PhotonImage | undefined;
  try {
    input = PhotonImage.new_from_byteslice(bytes);
    const width = input.get_width();
    const height = input.get_height();
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));

    const source =
      scale < 1
        ? (resized = resize(input, Math.round(width * scale), Math.round(height * scale), SamplingFilter.Lanczos3))
        : input;

    if (contentType === "image/png") {
      return { bytes: source.get_bytes(), contentType: "image/png", ext: "png" };
    }
    return { bytes: source.get_bytes_jpeg(JPEG_QUALITY), contentType: "image/jpeg", ext: "jpg" };
  } catch (e) {
    console.warn(`[upload] Image processing failed, storing original — ${e instanceof Error ? e.message : String(e)}`);
    return fallback;
  } finally {
    input?.free();
    resized?.free();
  }
}

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

  const originalBytes = new Uint8Array(await file.arrayBuffer());
  const { bytes: outBytes, contentType: outType, ext } = await compressImage(originalBytes, file.type);

  // Extension is controlled by the actual output format above, not whatever
  // the upload arrived with — serving (functions/api/images/[[key]].ts) sets
  // Content-Type from the stored R2 metadata, not this path, so this is only
  // for human-readability when browsing the bucket.
  const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 100).replace(/\.[a-zA-Z0-9]+$/, "");
  const key = `${kind}/${countrySlug || "misc"}/${Date.now()}-${safeName}.${ext}`;

  await env.IMAGES.put(key, outBytes, {
    httpMetadata: { contentType: outType },
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
