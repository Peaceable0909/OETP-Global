import { getDestinations } from "@/lib/data/destinations";
import { debugQueryD1 } from "@/lib/data/d1";

// Temporary, unlisted diagnostic — brand-new route so there's no pre-existing
// build artifact for it to reuse, isolating whether getDestinations() (the
// real production code path) sees live D1 data during THIS build, versus the
// long-standing /destinations/cambodia route possibly reusing a stale
// pre-rendered output from before the cache: no-store fix. Delete once done.
export default async function BuildStatusV3Page() {
  const destinations = await getDestinations();
  const cambodia = destinations.find((d) => d.slug === "cambodia");
  const productionQueryProbe = await debugQueryD1(
    "SELECT * FROM countries WHERE status = 'published' ORDER BY name"
  );
  const countQueryProbe = await debugQueryD1(
    "SELECT count(*) as c FROM countries WHERE status = 'published'"
  );
  return (
    <pre style={{ padding: 24, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
      {JSON.stringify(
        {
          cambodiaTagline: cambodia?.tagline,
          count: destinations.length,
          builtAt: new Date().toISOString(),
          productionQueryProbe,
          countQueryProbe,
        },
        null,
        2
      )}
    </pre>
  );
}
