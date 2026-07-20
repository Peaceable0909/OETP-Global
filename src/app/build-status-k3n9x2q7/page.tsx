import { getD1Diagnostics } from "@/lib/data/d1";

// Temporary, unlisted diagnostic page — not linked from any nav. Bakes the
// actual reason the build-time D1 fetch falls back to static data into the
// static output, since Cloudflare Workers Build logs aren't otherwise
// readable. Unguessable path + booleans/lengths only (never credential
// values) so it's safe to have live briefly. Delete this page and the
// getD1Diagnostics() export once the root cause is confirmed and fixed.
export default async function BuildStatusPage() {
  const diag = await getD1Diagnostics();
  return (
    <pre style={{ padding: 24, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
      {JSON.stringify(diag, null, 2)}
    </pre>
  );
}
