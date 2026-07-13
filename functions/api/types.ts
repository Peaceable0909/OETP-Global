export type Env = {
  DB: D1Database;
  // R2 bucket for uploaded documents. Optional so the API degrades gracefully
  // until R2 is enabled on the Cloudflare account.
  DOCS?: R2Bucket;
  // R2 bucket for admin-uploaded country/program photos, publicly served.
  IMAGES?: R2Bucket;
  // Public base URL images in IMAGES resolve to (R2.dev or a custom domain).
  IMAGES_PUBLIC_BASE?: string;
  // Shared admin login password (Cloudflare secret).
  ADMIN_PASSWORD?: string;
  // Cloudflare Pages Deploy Hook URL, called on Publish to trigger a rebuild.
  DEPLOY_HOOK_URL?: string;
};

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
