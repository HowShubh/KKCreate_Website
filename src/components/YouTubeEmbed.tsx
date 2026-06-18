export function YouTubeEmbed({
  youtubeId,
  title = "YouTube video",
}: {
  youtubeId: string;
  title?: string;
}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-ink">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
