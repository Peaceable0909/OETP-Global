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
// Build-time-only diagnostic used by a temporary, unlisted debug page to make
// an otherwise silent fallback (queryD1 swallows every failure so builds
// never hard-fail) actually inspectable without dashboard log access. Never
// returns the credential values themselves — only whether they're present,
// their length, and what Cloudflare's API said. Delete alongside the debug
// page once the build-time credentials are confirmed working.
export async function getD1Diagnostics(): Promise<{
  hasAccountId: boolean;
  hasApiToken: boolean;
  accountIdLength: number;
  apiTokenLength: number;
  outcome: "no_credentials" | "http_error" | "api_error" | "network_error" | "ok";
  detail: string;
  publishedCountryCount?: number;
}> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const base = {
    hasAccountId: !!accountId,
    hasApiToken: !!apiToken,
    accountIdLength: accountId?.length ?? 0,
    apiTokenLength: apiToken?.length ?? 0,
  };

  if (!accountId || !apiToken) {
    return { ...base, outcome: "no_credentials" as const, detail: "CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN is not set in this build's environment." };
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${D1_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${apiToken}`, "content-type": "application/json" },
        body: JSON.stringify({ sql: "SELECT count(*) as c FROM countries WHERE status = 'published'" }),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      return { ...base, outcome: "http_error" as const, detail: `HTTP ${res.status} ${res.statusText} — ${text.slice(0, 500)}` };
    }
    const data = (await res.json()) as {
      success: boolean;
      errors?: unknown;
      result?: { results: { c: number }[]; success: boolean }[];
    };
    if (!data.success || !data.result?.[0]?.success) {
      return { ...base, outcome: "api_error" as const, detail: `Cloudflare API success:false — ${JSON.stringify(data.errors ?? "").slice(0, 500)}` };
    }
    return { ...base, outcome: "ok" as const, detail: "Query succeeded.", publishedCountryCount: data.result[0].results[0]?.c ?? 0 };
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
