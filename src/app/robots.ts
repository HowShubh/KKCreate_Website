import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

// /robots.txt — everything public is crawlable (including AI crawlers such
// as GPTBot, ClaudeBot, PerplexityBot — they follow the `*` rule); the
// writers' area, editor API and private draft previews are not.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/write", "/api/", "/photo-essays/preview/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
