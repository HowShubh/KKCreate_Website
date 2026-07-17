import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { draftId, requireEditor } from "@/lib/editorApi";

type Params = { params: Promise<{ id: string }> };

type PublishableDoc = Record<string, unknown> & {
  _id: string;
  title?: string;
  dek?: string;
  location?: string;
  publishedAt?: string;
  slug?: { current?: string };
  author?: { _ref?: string };
  body?: unknown[];
};

// POST → copy the draft over the published document and delete the draft.
export async function POST(_req: NextRequest, { params }: Params) {
  const guard = await requireEditor();
  if (guard.error) return guard.error;
  const { id } = await params;

  const draft = await guard.client.fetch<PublishableDoc | null>(
    `*[_id == $id][0]`,
    { id: draftId(id) },
  );
  if (!draft) {
    return NextResponse.json(
      { ok: false, message: "Nothing to publish — no unpublished changes." },
      { status: 404 },
    );
  }

  const missing = [
    !draft.title?.trim() && "a title",
    !draft.dek?.trim() && "a dek (the italic line under the title)",
    !draft.slug?.current && "a slug (in Story settings)",
    !draft.location?.trim() && "a location",
    !draft.author?._ref && "an author",
    !draft.publishedAt && "a publish date",
    !(draft.body && draft.body.length > 0) && "some body content",
  ].filter(Boolean) as string[];
  if (missing.length) {
    return NextResponse.json(
      { ok: false, message: `Before publishing, add ${missing.join(", ")}.` },
      { status: 422 },
    );
  }

  // Slug must not collide with a different essay.
  const clash = await guard.client.fetch<string | null>(
    `*[_type == "photoEssay" && slug.current == $slug && !(_id in [$id, $draft])][0]._id`,
    { slug: draft.slug!.current, id, draft: draftId(id) },
  );
  if (clash) {
    return NextResponse.json(
      { ok: false, message: `The slug "${draft.slug!.current}" is already used by another essay.` },
      { status: 422 },
    );
  }

  const { _id: _drop, ...fields } = draft;
  await guard.client
    .transaction()
    .createOrReplace({ ...fields, _id: id, _type: "photoEssay" })
    .delete(draftId(id))
    .commit();

  revalidateTag("photo-essays");
  return NextResponse.json({ ok: true });
}
