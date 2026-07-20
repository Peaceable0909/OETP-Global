// Shared build-time Cloudflare D1 HTTP API client. Used by data loaders
// (destinations.ts, site.ts) to pull published content at build time via
// CLOUDFLARE_ACCOUNT_ID/CLOUDFLARE_API_TOKEN build env vars. Returns null on
// any failure (missing creds, network error, bad response) so callers can
// fall back to static defaults and builds never hard-fail.

const D1_DATABASE_ID = "a23e3497-2f70-48c4-9f95-af493a5e8204";

// Next's App Router requires every fetch() in a static export (`output:
// "export"`) to stay statically cacheable — `cache: "no-store"` throws a
// build-time "couldn't be rendered statically" error instead (silently
// swallowed by queryD1's own catch below, so it just looked like another
// silent fallback). But leaving fetch() fully default-cached is exactly what
// caused the original bug: Cloudflare Workers Build persists its Next.js
// build cache between separate CI runs, so the same request (same URL +
// body) reused whichever response got cached on the very first successful
// build, forever. Fix: keep the fetch cacheable (required for export), but
// make the cache key unique per build via a query param, so there's nothing
// stale to reuse — this value is fixed once per build, not per request.
const BUILD_STAMP = Date.now();

// A failure here is otherwise completely silent — the only symptom is stale
// fallback content on the live site. console.warn surfaces the reason in
// Cloudflare's Workers Build logs (dashboard-only, already private to the
// account) without exposing anything through the deployed site itself.
// Never logs the credential values themselves, only whether they're present.
export async function queryD1<T = Record<string, unknown>>(sql: string): Promise<T[] | null> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    console.warn(
      `[queryD1] Skipping D1 fetch, falling back to static data — CLOUDFLARE_ACCOUNT_ID present: ${!!accountId}, CLOUDFLARE_API_TOKEN present: ${!!apiToken}`
    );
    return null;
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${D1_DATABASE_ID}/query?_build=${BUILD_STAMP}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ sql }),
      }
    );
    if (!res.ok) {
      console.warn(`[queryD1] Cloudflare API responded ${res.status} ${res.statusText} — falling back to static data`);
      return null;
    }

    const data = (await res.json()) as {
      success: boolean;
      errors?: unknown;
      result?: { results: T[]; success: boolean }[];
    };
    if (!data.success || !data.result?.[0]?.success) {
      console.warn(`[queryD1] Cloudflare API returned success:false — falling back to static data. errors: ${JSON.stringify(data.errors ?? "").slice(0, 300)}`);
      return null;
    }

    return data.result[0].results;
  } catch (e) {
    console.warn(`[queryD1] Request threw — falling back to static data: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}
