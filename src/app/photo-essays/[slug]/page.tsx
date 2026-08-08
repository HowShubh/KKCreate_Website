import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EssayArticle } from "@/components/EssayArticle";
import { SITE } from "@/lib/content";
import { PHOTO_ESSAYS_LIVE } from "@/lib/featureFlags";
import {
  getPhotoEssay,
  getPhotoEssays,
  getReadNext,
  type PhotoEssay,
} from "@/lib/photoEssays";
import { SITE_URL } from "@/lib/siteUrl";

export async function generateStaticParams() {
  // Nothing is published while the section is gated, so don't prerender any.
  if (!PHOTO_ESSAYS_LIVE) return [];
  const essays = await getPhotoEssays();
  return essays.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  if (!PHOTO_ESSAYS_LIVE) return {};
  const { slug } = await params;
  const essay = await getPhotoEssay(slug);
  if (!essay) return {};
  return {
    title: essay.title,
    description: essay.dek,
    openGraph: {
      title: essay.title,
      description: essay.dek,
      type: "article",
      // The cover is the essay's thumbnail — link previews use it too.
      images: essay.cover.src ? [essay.cover.src] : undefined,
    },
  };
}

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Gated: no essay URL should resolve, even if drafts exist in Sanity.
  if (!PHOTO_ESSAYS_LIVE) notFound();

  const { slug } = await params;
  const essay = await getPhotoEssay(slug);
  if (!essay) notFound();
  const readNext = await getReadNext(slug);
  return (
    <>
      {/* Article structured data — how search engines and AI assistants
          reliably extract the headline, author and date. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(essay)) }}
      />
      <EssayArticle essay={essay} readNext={readNext} />
    </>
  );
}

function articleJsonLd(essay: PhotoEssay) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: essay.title,
    description: essay.dek,
    datePublished: essay.publishedAt,
    author: { "@type": "Person", name: essay.author.name },
    publisher: { "@type": "Organization", name: SITE.company, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/photo-essays/${essay.slug}`,
    ...(essay.cover.src ? { image: [essay.cover.src] } : {}),
    ...(essay.location
      ? { contentLocation: { "@type": "Place", name: essay.location } }
      : {}),
    keywords: essay.tags.join(", ") || undefined,
  };
}
