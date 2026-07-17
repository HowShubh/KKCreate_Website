import { defineSchema, keyGenerator } from "@portabletext/editor";
import type { PortableTextBlock } from "@portabletext/editor";
import { urlForImage } from "@/sanity/image";
import type { EditorEssayDoc } from "@/lib/editorApi";

// Client-side helpers for the /write editor.

/** What the editor lets writers produce — mirrors the photoEssay body schema. */
export const editorSchemaDefinition = defineSchema({
  decorators: [{ name: "strong" }, { name: "em" }],
  annotations: [
    { name: "link", fields: [{ name: "href", type: "string" }] },
  ],
  styles: [
    { name: "normal", title: "Normal" },
    { name: "pullQuote", title: "Pull quote" },
  ],
  lists: [],
  inlineObjects: [],
  blockObjects: [
    {
      name: "essayImage",
      fields: [
        { name: "image", type: "object" },
        { name: "fullBleed", type: "boolean" },
      ],
    },
    {
      name: "imagePair",
      fields: [
        { name: "left", type: "object" },
        { name: "right", type: "object" },
      ],
    },
    {
      name: "youtube",
      fields: [
        { name: "url", type: "string" },
        { name: "caption", type: "string" },
      ],
    },
    {
      name: "socialEmbed",
      fields: [{ name: "url", type: "string" }],
    },
  ],
});

export type EditorImageValue = {
  _type: "image";
  asset?: { _type: "reference"; _ref: string };
  alt?: string;
  caption?: string;
};

export function emptyParagraph(): PortableTextBlock {
  return {
    _type: "block",
    _key: keyGenerator(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: keyGenerator(), text: "", marks: [] }],
  };
}

/**
 * Prepares a stored body for editing: legacy pullQuote objects (from the
 * Studio/seed era) become directly-typable pullQuote-styled text blocks, and
 * an empty body gets a starter paragraph.
 */
export function normalizeBody(body: unknown[]): PortableTextBlock[] {
  const blocks = (Array.isArray(body) ? body : []).map((raw) => {
    const block = raw as PortableTextBlock & { quote?: string };
    if (block._type === "pullQuote") {
      return {
        _type: "block",
        _key: block._key ?? keyGenerator(),
        style: "pullQuote",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: keyGenerator(),
            text: block.quote ?? "",
            marks: [],
          },
        ],
      } as PortableTextBlock;
    }
    return block;
  });
  return blocks.length ? blocks : [emptyParagraph()];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 96);
}

/** Render URL for a Sanity image reference — public config, safe in browser. */
export function editorImageUrl(
  image: EditorImageValue | null | undefined,
  width = 1600,
): string | null {
  if (!image?.asset?._ref) return null;
  try {
    return urlForImage(image).width(width).url();
  } catch {
    return null;
  }
}

/** Extracts a YouTube video id from the common URL shapes. */
export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

export function bodyStats(body: PortableTextBlock[] | undefined): {
  words: number;
  minutes: number;
  photos: number;
} {
  let words = 0;
  let photos = 0;
  for (const block of body ?? []) {
    if (block._type === "block" && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (typeof (child as { text?: string }).text === "string") {
          words += ((child as { text: string }).text.match(/\S+/g) ?? []).length;
        }
      }
    }
    if (block._type === "essayImage") photos += 1;
    if (block._type === "imagePair") photos += 2;
  }
  return { words, minutes: Math.max(1, Math.round(words / 220 + photos * 0.2)), photos };
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** fetch wrapper: JSON in/out, throws ApiError with the server's message. */
export async function api<T = Record<string, unknown>>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    headers: init?.body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, (data as { message?: string }).message ?? res.statusText);
  }
  return data as T;
}

export async function uploadImage(file: File): Promise<{ assetId: string; url: string }> {
  const form = new FormData();
  form.append("file", file);
  return api("/api/editor/upload", { method: "POST", body: form });
}

export type { EditorEssayDoc };
