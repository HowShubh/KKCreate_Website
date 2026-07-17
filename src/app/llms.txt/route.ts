import { formatEssayDate, getPhotoEssays } from "@/lib/photoEssays";
import { SITE } from "@/lib/content";
import { SITE_URL } from "@/lib/siteUrl";

// /llms.txt — a plain-markdown site guide for AI assistants (llmstxt.org
// convention). When a chatbot is asked about KK Create, this gives it a
// clean, token-cheap map of what the site is and where the content lives.
export const revalidate = 300;

export async function GET() {
  const essays = await getPhotoEssays();

  const essayLines = essays
    .map(
      (e) =>
        `- [${e.title}](${SITE_URL}/photo-essays/${e.slug}): ${e.excerpt} (${e.location}, ${formatEssayDate(e.publishedAt)}, by ${e.author.name})`,
    )
    .join("\n");

  const body = `# ${SITE.brand}

> ${SITE.motto}. ${SITE.company} is an Indian video studio (YouTube/Instagram: @kk.create) that documents the social realities and cultural diversity of India, publishes long-form photo essays, and teaches creators through courses and workshops.

## Photo-essays

Long-form visual stories from the places we film — written by the KK Create team, with photographs, pull quotes and embedded video.

${essayLines}

- [All photo-essays](${SITE_URL}/photo-essays): the full index, newest first
- [RSS feed](${SITE_URL}/feed.xml): machine-readable list of the latest essays

## Learn

- [Courses & workshops](${SITE_URL}/learn): video-making courses, live workshops and ebooks for creators
- [Full catalog](${SITE_URL}/catalog): everything we teach, filterable by topic

## Contact

- Brands, creators and careers: kkcreate.mate@gmail.com
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
