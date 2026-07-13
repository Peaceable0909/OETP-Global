// Shared build-time Cloudflare D1 HTTP API client. Used by data loaders
// (destinations.ts, site.ts) to pull published content at build time via
// CLOUDFLARE_ACCOUNT_ID/CLOUDFLARE_API_TOKEN build env vars. Returns null on
// any failure (missing creds, network error, bad response) so callers can
// fall back to static defaults and builds never hard-fail.

const D1_DATABASE_ID = "a23e3497-2f70-48c4-9f95-af493a5e8204";

export async function queryD1<T = Record<string, unknown>>(sql: string): Promise<T[] | null> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return null;

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${D1_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ sql }),
      }
    );
    if (!res.ok) return null;

    const data = (await res.json()) as {
      success: boolean;
      result?: { results: T[]; success: boolean }[];
    };
    if (!data.success || !data.result?.[0]?.success) return null;

    return data.result[0].results;
  } catch {
    return null;
  }
}
