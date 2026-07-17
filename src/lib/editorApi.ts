import { NextResponse } from "next/server";
import type { SanityClient } from "next-sanity";
import { isEditorAuthed } from "@/lib/editorAuth";
import { sanityWriteClient } from "@/sanity/writeClient";

// Shared plumbing for the /write editor API routes: session + config guard
// and the wire types exchanged with the editor UI.

/** Raw Sanity image object as stored on the document. */
export type EditorImage = {
  _type: "image";
  asset?: { _type: "reference"; _ref: string };
  alt?: string;
  caption?: string;
} | null;

/** Everything the editor edits, keyed by the base (published) document id. */
export type EditorEssayDoc = {
  title: string;
  slug: string;
  dek: string;
  excerpt: string;
  location: string;
  publishedAt: string;
  tags: string[];
  videoUrl: string;
  readMinutes: number | null;
  authorId: string | null;
  cover: EditorImage;
  body: unknown[];
};

export type EssayListItem = {
  id: string;
  title: string;
  location: string;
  slug: string;
  updatedAt: string;
  publishedAt: string;
  authorName: string | null;
  status: "draft" | "published" | "published+draft";
};

export const draftId = (id: string) => `drafts.${id}`;
export const baseId = (id: string) => id.replace(/^drafts\./, "");

/**
 * Guard for every editor endpoint. Returns `{ client }` when the request may
 * proceed, or a ready-to-return error response.
 */
export async function requireEditor(): Promise<
  { client: SanityClient; error?: undefined } | { client?: undefined; error: NextResponse }
> {
  if (!(await isEditorAuthed())) {
    return {
      error: NextResponse.json(
        { ok: false, message: "Not signed in." },
        { status: 401 },
      ),
    };
  }
  if (!sanityWriteClient) {
    return {
      error: NextResponse.json(
        {
          ok: false,
          message:
            "Sanity write access is not configured — set SANITY_API_WRITE_TOKEN (an Editor-role token from sanity.io/manage).",
        },
        { status: 503 },
      ),
    };
  }
  return { client: sanityWriteClient };
}

/** Assembles the Sanity document from an editor payload. */
export function toSanityDoc(id: string, doc: EditorEssayDoc) {
  return {
    _id: id,
    _type: "photoEssay" as const,
    title: doc.title,
    slug: { _type: "slug" as const, current: doc.slug },
    dek: doc.dek,
    excerpt: doc.excerpt || undefined,
    location: doc.location,
    publishedAt: doc.publishedAt,
    tags: doc.tags?.length ? doc.tags : undefined,
    videoUrl: doc.videoUrl || undefined,
    readMinutes: doc.readMinutes || undefined,
    author: doc.authorId
      ? { _type: "reference" as const, _ref: doc.authorId }
      : undefined,
    cover: doc.cover ?? undefined,
    body: doc.body ?? [],
  };
}
