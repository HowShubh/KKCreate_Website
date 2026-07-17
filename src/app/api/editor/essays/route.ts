import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import {
  baseId,
  draftId,
  requireEditor,
  type EssayListItem,
} from "@/lib/editorApi";

type RawListDoc = {
  _id: string;
  _updatedAt: string;
  title?: string;
  location?: string;
  slug?: string;
  publishedAt?: string;
  authorName?: string;
};

// GET → all essays (drafts + published merged per base id), newest first.
export async function GET() {
  const guard = await requireEditor();
  if (guard.error) return guard.error;

  const docs = await guard.client.fetch<RawListDoc[]>(
    `*[_type == "photoEssay"]{
      _id, _updatedAt, title, location, publishedAt,
      "slug": slug.current, "authorName": author->name
    }`,
  );

  const byBase = new Map<string, { draft?: RawListDoc; published?: RawListDoc }>();
  for (const doc of docs) {
    const key = baseId(doc._id);
    const entry = byBase.get(key) ?? {};
    if (doc._id.startsWith("drafts.")) entry.draft = doc;
    else entry.published = doc;
    byBase.set(key, entry);
  }

  const essays: EssayListItem[] = [...byBase.entries()].map(
    ([id, { draft, published }]) => {
      const doc = draft ?? published!;
      return {
        id,
        title: doc.title || "Untitled essay",
        location: doc.location ?? "",
        slug: doc.slug ?? "",
        updatedAt: doc._updatedAt,
        publishedAt: doc.publishedAt ?? "",
        authorName: doc.authorName ?? null,
        status: published
          ? draft
            ? "published+draft"
            : "published"
          : "draft",
      };
    },
  );
  essays.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  return NextResponse.json({ ok: true, essays });
}

// POST → create a fresh draft, returns its base id.
export async function POST(req: NextRequest) {
  const guard = await requireEditor();
  if (guard.error) return guard.error;

  const { title } = await req.json().catch(() => ({}));
  const id = `photoEssay.${randomUUID().slice(0, 8)}`;

  await guard.client.create({
    _id: draftId(id),
    _type: "photoEssay",
    title: typeof title === "string" ? title : "",
    publishedAt: new Date().toISOString().slice(0, 10),
    body: [],
  });

  return NextResponse.json({ ok: true, id });
}
