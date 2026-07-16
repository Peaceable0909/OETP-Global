import { getD1Diagnostics } from "@/lib/data/d1";

// Temporary, unlinked diagnostic page — bakes the build-time D1 connectivity
// result into the static output itself, since Workers Build logs aren't
// otherwise reachable from outside the Cloudflare dashboard. Delete once the
// build-time D1 credentials are confirmed working.
export default async function BuildStatusPage() {
  const diag = await getD1Diagnostics();
  const buildTime = new Date().toISOString();

  return (
    <pre style={{ padding: 24, fontSize: 13, whiteSpace: "pre-wrap" }}>
      {JSON.stringify({ buildTime, ...diag }, null, 2)}
    </pre>
  );
}
