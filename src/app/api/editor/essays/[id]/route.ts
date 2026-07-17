import { NextResponse, type NextRequest } from "next/server";
import {
  draftId,
  requireEditor,
  toSanityDoc,
  type EditorEssayDoc,
} from "@/lib/editorApi";
import { previewToken } from "@/lib/editorAuth";

type Params = { params: Promise<{ id: string }> };

type RawEssayDoc = {
  _id: string;
  title?: string;
  dek?: string;
  excerpt?: string;
  location?: string;
  publishedAt?: string;
  tags?: string[];
  videoUrl?: string;
  readMinutes?: number;
  slug?: { current?: string };
  author?: { _ref?: string };
  cover?: EditorEssayDoc["cover"];
  body?: unknown[];
};

// GET → the editable document (draft preferred, else published).
export async function GET(req: NextRequest, { params }: Params) {
  const guard = await requireEditor();
  if (guard.error) return guard.error;
  const { id } = await params;

  const docs = await guard.client.fetch<RawEssayDoc[]>(
    `*[_id in [$draft, $published]]`,
    { draft: draftId(id), published: id },
  );
  const draft = docs.find((d) => d._id === draftId(id));
  const published = docs.find((d) => d._id === id);
  const doc = draft ?? published;
  if (!doc) {
    return NextResponse.json(
      { ok: false, message: "Essay not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    doc: {
      title: doc.title ?? "",
      slug: doc.slug?.current ?? "",
      dek: doc.dek ?? "",
      excerpt: doc.excerpt ?? "",
      location: doc.location ?? "",
      publishedAt: doc.publishedAt ?? "",
      tags: doc.tags ?? [],
      videoUrl: doc.videoUrl ?? "",
      readMinutes: doc.readMinutes ?? null,
      authorId: doc.author?._ref ?? null,
      cover: doc.cover ?? null,
      body: doc.body ?? [],
    } satisfies EditorEssayDoc,
    hasDraft: Boolean(draft),
    isPublished: Boolean(published),
    // Secret reviewer link for this essay's working version.
    previewUrl: (() => {
      const token = previewToken(id);
      return token
        ? `${req.nextUrl.origin}/photo-essays/preview/${encodeURIComponent(id)}?key=${token}`
        : null;
    })(),
  });
}

// PUT → save the draft (autosave target).
export async function PUT(req: NextRequest, { params }: Params) {
  const guard = await requireEditor();
  if (guard.error) return guard.error;
  const { id } = await params;

  const doc = (await req.json()) as EditorEssayDoc;
  await guard.client.createOrReplace(toSanityDoc(draftId(id), doc));
  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}

// DELETE → ?scope=draft discards the draft; otherwise deletes the essay
// entirely (draft + published).
export async function DELETE(req: NextRequest, { params }: Params) {
  const guard = await requireEditor();
  if (guard.error) return guard.error;
  const { id } = await params;

  const tx = guard.client.transaction().delete(draftId(id));
  if (req.nextUrl.searchParams.get("scope") !== "draft") tx.delete(id);
  await tx.commit();
  return NextResponse.json({ ok: true });
}
