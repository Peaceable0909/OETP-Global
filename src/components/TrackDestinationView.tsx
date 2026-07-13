"use client";

import { useEffect } from "react";

export default function TrackDestinationView({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/track/destination-view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug]);

  return null;
}
