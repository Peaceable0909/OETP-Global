// Shared build-time Cloudflare D1 HTTP API client. Used by data loaders
// (destinations.ts, site.ts) to pull published content at build time via
// CLOUDFLARE_ACCOUNT_ID/CLOUDFLARE_API_TOKEN build env vars. Returns null on
// any failure (missing creds, network error, bad response) so callers can
// fall back to static defaults and builds never hard-fail.

const D1_DATABASE_ID = "a23e3497-2f70-48c4-9f95-af493a5e8204";

// A failure here is otherwise completely silent — the only symptom is stale
// fallback content on the live site. console.warn surfaces the reason in
// Cloudflare's Workers Build logs (dashboard-only, already private to the
// account) without exposing anything through the deployed site itself.
// Never logs the credential values themselves, only whether they're present.
// Temporary diagnostic — runs an arbitrary SQL string and reports exactly
// why it failed (credential presence, HTTP status, API error text — never
// credential values) instead of silently returning null like queryD1. Used
// to compare the exact production query against a known-good one. Delete
// alongside the debug page once the root cause is confirmed.
export async function debugQueryD1(sql: string): Promise<{
  hasAccountId: boolean;
  hasApiToken: boolean;
  outcome: "no_credentials" | "http_error" | "api_error" | "network_error" | "ok";
  detail: string;
  rowCount?: number;
}> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const base = { hasAccountId: !!accountId, hasApiToken: !!apiToken };
  if (!accountId || !apiToken) {
    return { ...base, outcome: "no_credentials" as const, detail: "Missing credentials in this build." };
  }
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${D1_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${apiToken}`, "content-type": "application/json" },
        body: JSON.stringify({ sql }),
        cache: "no-store",
      }
    );
    if (!res.ok) {
      const text = await res.text();
      return { ...base, outcome: "http_error" as const, detail: `HTTP ${res.status} ${res.statusText} — ${text.slice(0, 800)}` };
    }
    const data = (await res.json()) as {
      success: boolean;
      errors?: unknown;
      result?: { results: unknown[]; success: boolean }[];
    };
    if (!data.success || !data.result?.[0]?.success) {
      return { ...base, outcome: "api_error" as const, detail: `success:false — ${JSON.stringify(data.errors ?? "").slice(0, 800)}` };
    }
    return { ...base, outcome: "ok" as const, detail: "Query succeeded.", rowCount: data.result[0].results.length };
  } catch (e) {
    return { ...base, outcome: "network_error" as const, detail: e instanceof Error ? e.message : String(e) };
  }
}

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
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${D1_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ sql }),
        // Next.js's App Router caches fetch() by default and persists that
        // cache to disk across builds — Cloudflare Workers Build retains
        // that cache between CI runs, so without this every rebuild was
        // silently reusing whichever result got cached on the very first
        // successful build, never picking up later D1 edits.
        cache: "no-store",
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
