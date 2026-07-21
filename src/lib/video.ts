// Turns a YouTube/Vimeo URL into its embeddable iframe src. Returns null for
// anything else (a direct .mp4 link, or a URL we don't recognize), which the
// caller should render with a plain <video> tag instead.
export function videoEmbedSrc(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }

  const host = u.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
    const parts = u.pathname.split("/").filter(Boolean);
    if ((parts[0] === "embed" || parts[0] === "shorts") && parts[1]) {
      return `https://www.youtube.com/embed/${parts[1]}`;
    }
    return null;
  }

  if (host === "vimeo.com") {
    const id = u.pathname.split("/").filter(Boolean).pop();
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }

  return null;
}
