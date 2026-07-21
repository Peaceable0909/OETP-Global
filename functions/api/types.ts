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
  // Resend API key (Cloudflare secret) for outbound applicant emails. Optional
  // so apply.ts / admin applications PATCH degrade gracefully until Resend is configured.
  RESEND_API_KEY?: string;
  // Override the From header once tenzaglobal.com is verified in Resend; falls
  // back to a Resend sandbox sender in _email.ts until then.
  EMAIL_FROM?: string;
};

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
