import type { Env } from "../types";

// Streams admin-uploaded photos straight out of the IMAGES R2 bucket. This
// exists so uploads have a working public URL without needing R2's public
// access (or a custom domain) turned on in the Cloudflare dashboard — the
// bucket stays private, and this route is the only thing that reads it.
export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  if (!env.IMAGES) return new Response("Not found", { status: 404 });

  const segments = params.key;
  const key = Array.isArray(segments) ? segments.join("/") : segments;
  if (!key) return new Response("Not found", { status: 404 });

  const object = await env.IMAGES.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  // Keys are timestamped on upload, so a given URL's content never changes.
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
};
