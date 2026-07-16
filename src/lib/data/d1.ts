// Shared build-time Cloudflare D1 HTTP API client. Used by data loaders
// (destinations.ts, site.ts) to pull published content at build time via
// CLOUDFLARE_ACCOUNT_ID/CLOUDFLARE_API_TOKEN build env vars. Returns null on
// any failure (missing creds, network error, bad response) so callers can
// fall back to static defaults and builds never hard-fail.

const D1_DATABASE_ID = "a23e3497-2f70-48c4-9f95-af493a5e8204";

// Mirrors queryD1's own logic so the two can never disagree about *why* a
// build fell back to static data — see getD1Diagnostics below.
type D1Diagnostic = {
  hasAccountId: boolean;
  hasApiToken: boolean;
  accountIdLength: number;
  apiTokenLength: number;
  outcome: "no_credentials" | "http_error" | "api_error" | "network_error" | "ok";
  detail: string;
};

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

// Build-time-only diagnostic used by /_build-status to make an otherwise
// silent fallback (queryD1 swallows every failure so builds never hard-fail)
// actually debuggable. Never returns the credential values themselves —
// only whether they're present, their length, and what Cloudflare's API said.
export async function getD1Diagnostics(): Promise<D1Diagnostic> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const base: Pick<D1Diagnostic, "hasAccountId" | "hasApiToken" | "accountIdLength" | "apiTokenLength"> = {
    hasAccountId: !!accountId,
    hasApiToken: !!apiToken,
    accountIdLength: accountId?.length ?? 0,
    apiTokenLength: apiToken?.length ?? 0,
  };

  if (!accountId || !apiToken) {
    return { ...base, outcome: "no_credentials", detail: "CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN is not set in this build's environment." };
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${D1_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${apiToken}`, "content-type": "application/json" },
        body: JSON.stringify({ sql: "SELECT 1 as ok" }),
      }
    );
    const text = await res.text();
    if (!res.ok) {
      return { ...base, outcome: "http_error", detail: `Cloudflare API responded ${res.status} ${res.statusText}: ${text.slice(0, 500)}` };
    }
    const data = JSON.parse(text) as { success: boolean; errors?: unknown; result?: { success: boolean }[] };
    if (!data.success || !data.result?.[0]?.success) {
      return { ...base, outcome: "api_error", detail: `Cloudflare API returned success:false — ${JSON.stringify(data.errors ?? data).slice(0, 500)}` };
    }
    return { ...base, outcome: "ok", detail: "D1 query succeeded." };
  } catch (e) {
    return { ...base, outcome: "network_error", detail: e instanceof Error ? e.message : String(e) };
  }
}
