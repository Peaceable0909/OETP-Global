import { videoEmbedSrc } from "@/lib/video";

export default function VideoGrid({
  videos,
  accent,
}: {
  videos: { title: string; url: string }[];
  accent: string;
}) {
  if (videos.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {videos.map((v, i) => {
        const embed = videoEmbedSrc(v.url);
        return (
          <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="aspect-video w-full bg-black">
              {embed ? (
                <iframe
                  src={embed}
                  title={v.title || `Video ${i + 1}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video controls className="h-full w-full" src={v.url} />
              )}
            </div>
            {v.title && (
              <p className="p-4 text-sm font-bold" style={{ color: accent }}>
                {v.title}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
