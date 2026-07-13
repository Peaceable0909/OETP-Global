export type Env = {
  DB: D1Database;
  // R2 bucket for uploaded documents. Optional so the API degrades gracefully
  // until R2 is enabled on the Cloudflare account.
  DOCS?: R2Bucket;
};

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
