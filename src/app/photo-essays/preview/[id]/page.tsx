import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EssayArticle } from "@/components/EssayArticle";
import { isValidPreviewToken } from "@/lib/editorAuth";
import { getPreviewPhotoEssay, getReadNext } from "@/lib/photoEssays";

// Shareable draft preview: /photo-essays/preview/<id>?key=<token>. The token
// is derived from EDITOR_PASSWORD (see editorAuth.previewToken), so anyone
// holding the link — and only them — can view this one draft. Never indexed.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Draft preview",
  robots: { index: false, follow: false },
};

export default async function EssayPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const [{ id: rawId }, { key }] = await Promise.all([params, searchParams]);
  const id = decodeURIComponent(rawId);
  if (!key || !isValidPreviewToken(id, key)) notFound();

  const essay = await getPreviewPhotoEssay(id);
  if (!essay) notFound();
  const readNext = await getReadNext(essay.slug);

  return (
    <>
      <div className="sticky top-16 z-40 border-b border-marigold/30 bg-marigold/15 px-5 py-2 text-center text-sm text-content backdrop-blur-sm">
        Draft preview — this is how the essay will look. It isn&rsquo;t
        published yet and this link is private.
      </div>
      <EssayArticle essay={essay} readNext={readNext} />
    </>
  );
}
