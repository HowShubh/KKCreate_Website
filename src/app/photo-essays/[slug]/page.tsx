import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EssayArticle } from "@/components/EssayArticle";
import { getPhotoEssay, getPhotoEssays, getReadNext } from "@/lib/photoEssays";

export async function generateStaticParams() {
  const essays = await getPhotoEssays();
  return essays.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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
  const { slug } = await params;
  const essay = await getPhotoEssay(slug);
  if (!essay) notFound();
  const readNext = await getReadNext(slug);
  return <EssayArticle essay={essay} readNext={readNext} />;
}
