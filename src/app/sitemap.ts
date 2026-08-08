import type { MetadataRoute } from "next";
import { PHOTO_ESSAYS_LIVE } from "@/lib/featureFlags";
import { getPhotoEssays } from "@/lib/photoEssays";
import { SITE_URL } from "@/lib/siteUrl";

// /sitemap.xml — tells search engines and AI crawlers every page worth
// indexing, with freshness hints. Essays are appended dynamically.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/learn`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/catalog`, changeFrequency: "weekly", priority: 0.8 },
  ];

  // While the section is gated there's nothing to index — neither the landing
  // page (a coming-soon banner) nor any essay URL (they 404).
  if (!PHOTO_ESSAYS_LIVE) return staticPages;

  const essays = await getPhotoEssays();

  return [
    ...staticPages,
    {
      url: `${SITE_URL}/photo-essays`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...essays.map((essay) => ({
      url: `${SITE_URL}/photo-essays/${essay.slug}`,
      lastModified: essay.publishedAt ? new Date(essay.publishedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
