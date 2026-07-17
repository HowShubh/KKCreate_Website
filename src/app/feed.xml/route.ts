import { getPhotoEssays } from "@/lib/photoEssays";
import { SITE } from "@/lib/content";
import { SITE_URL } from "@/lib/siteUrl";

// /feed.xml — RSS 2.0 feed of the photo-essays. Feed readers subscribe to
// it, newsletter tools can auto-send on new items, and search/AI indexes
// use it to discover new essays quickly.
export const revalidate = 300;

function xml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function GET() {
  const essays = await getPhotoEssays();

  const items = essays
    .map((essay) => {
      const url = `${SITE_URL}/photo-essays/${essay.slug}`;
      const pubDate = essay.publishedAt
        ? new Date(essay.publishedAt).toUTCString()
        : "";
      return `    <item>
      <title>${xml(essay.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xml(essay.excerpt)}</description>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
      <dc:creator>${xml(essay.author.name)}</dc:creator>
      ${essay.cover.src ? `<enclosure url="${xml(essay.cover.src)}" type="image/jpeg" length="0" />` : ""}
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(SITE.brand)} — Photo-essays</title>
    <link>${SITE_URL}/photo-essays</link>
    <description>${xml(
      "Long-form visual stories from the places we film — the frames, faces and footnotes that never make the final cut.",
    )}</description>
    <language>en-in</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
