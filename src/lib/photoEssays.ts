import { sanityClient } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";

// The single source of photo-essay data for the site. When Sanity has
// photoEssay documents it reads those; otherwise it falls back to the static
// essays in photoEssayContent.ts (same pattern as src/lib/catalog.ts).
//
// Sanity's portable-text body is normalized here so pages render one shape:
// image blocks get a resolved `src` URL, youtube blocks a parsed video id.

// --- normalized types ---------------------------------------------------------

export type EssayAuthor = {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  videoUrl?: string;
};

/** A photograph. `src` empty ⇒ render the textured placeholder with `label`. */
export type EssayImage = {
  src?: string;
  alt: string;
  caption?: string;
  label?: string;
};

export type EssaySpan = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

export type EssayBodyBlock =
  | {
      _type: "block";
      _key: string;
      /** "pullQuote" renders as the big italic quote with the saffron rule. */
      style: "normal" | "pullQuote";
      markDefs: { _key: string; _type: "link"; href: string }[];
      children: EssaySpan[];
    }
  | { _type: "essayImage"; _key: string; image: EssayImage; fullBleed?: boolean }
  | { _type: "imagePair"; _key: string; left: EssayImage; right: EssayImage }
  | { _type: "pullQuote"; _key: string; quote: string }
  | { _type: "youtube"; _key: string; youtubeId: string; caption?: string }
  | { _type: "socialEmbed"; _key: string; url: string };

export type PhotoEssay = {
  slug: string;
  title: string;
  dek: string;
  excerpt: string;
  location: string;
  publishedAt: string; // ISO date
  author: EssayAuthor;
  cover: EssayImage;
  body: EssayBodyBlock[];
  tags: string[];
  /** "Watch the video" target — essay's companion video, else author channel. */
  videoUrl?: string;
  readMinutes: number;
  photoCount: number;
};

// --- GROQ ----------------------------------------------------------------------

type SanityImageSource = Parameters<typeof urlForImage>[0];

type RawImage = {
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
} & SanityImageSource;

type RawBlock = {
  _type: string;
  _key: string;
  [k: string]: unknown;
};

type RawEssay = {
  slug: string;
  title: string;
  dek?: string;
  excerpt?: string;
  location?: string;
  publishedAt?: string;
  cover?: RawImage;
  body?: RawBlock[];
  tags?: string[];
  videoUrl?: string;
  readMinutes?: number;
  author?: {
    _id: string;
    name?: string;
    bio?: string;
    videoUrl?: string;
    avatar?: SanityImageSource;
  };
};

const FIELDS = `
  "slug": slug.current, title, dek, excerpt, location, publishedAt,
  cover{ ..., asset }, body[]{ ... }, tags, videoUrl, readMinutes,
  author->{ _id, name, bio, videoUrl, avatar }
`;

const ORDER = `order(publishedAt desc, _createdAt desc)`;
const LIST_QUERY = `*[_type == "photoEssay" && defined(slug.current)] | ${ORDER}{ ${FIELDS} }`;
const SLUG_QUERY = `*[_type == "photoEssay" && slug.current == $slug][0]{ ${FIELDS} }`;

const CACHE = { next: { tags: ["photo-essays"], revalidate: 300 } };

// --- mapping -------------------------------------------------------------------

function mapImage(raw: RawImage | undefined): EssayImage {
  if (!raw) return { alt: "" };
  return {
    src: raw.asset ? urlForImage(raw).width(2000).url() : undefined,
    alt: raw.alt ?? "",
    caption: raw.caption,
  };
}

/** Extracts a YouTube video id from the common URL shapes. */
export function youtubeIdFromUrl(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

function mapBody(raw: RawBlock[] | undefined): EssayBodyBlock[] {
  if (!raw) return [];
  const blocks: EssayBodyBlock[] = [];
  for (const b of raw) {
    switch (b._type) {
      case "block":
        blocks.push(b as unknown as EssayBodyBlock);
        break;
      case "essayImage":
        blocks.push({
          _type: "essayImage",
          _key: b._key,
          image: mapImage(b.image as RawImage),
          fullBleed: Boolean(b.fullBleed),
        });
        break;
      case "imagePair":
        blocks.push({
          _type: "imagePair",
          _key: b._key,
          left: mapImage(b.left as RawImage),
          right: mapImage(b.right as RawImage),
        });
        break;
      case "pullQuote":
        blocks.push({ _type: "pullQuote", _key: b._key, quote: String(b.quote ?? "") });
        break;
      case "youtube": {
        const id = youtubeIdFromUrl(String(b.url ?? ""));
        if (id)
          blocks.push({
            _type: "youtube",
            _key: b._key,
            youtubeId: id,
            caption: b.caption ? String(b.caption) : undefined,
          });
        break;
      }
      case "socialEmbed":
        if (b.url)
          blocks.push({ _type: "socialEmbed", _key: b._key, url: String(b.url) });
        break;
    }
  }
  return blocks;
}

// The cover is a listing thumbnail only (not shown in the article), so it
// doesn't count toward the byline's photograph count.
export function countPhotos(essay: Pick<PhotoEssay, "body">): number {
  let count = 0;
  for (const b of essay.body) {
    if (b._type === "essayImage") count += 1;
    if (b._type === "imagePair") count += 2;
  }
  return count;
}

function computeReadMinutes(body: EssayBodyBlock[], photos: number): number {
  let words = 0;
  for (const b of body) {
    if (b._type === "block")
      words += b.children.reduce(
        (n, c) => n + c.text.split(/\s+/).filter(Boolean).length,
        0,
      );
    if (b._type === "pullQuote") words += b.quote.split(/\s+/).length;
  }
  // ~220 wpm reading pace plus a beat for every photograph.
  return Math.max(1, Math.round(words / 220 + photos * 0.2));
}

function mapEssay(raw: RawEssay): PhotoEssay {
  const body = mapBody(raw.body);
  const cover = mapImage(raw.cover);
  const photoCount = countPhotos({ body });
  return {
    slug: raw.slug,
    title: raw.title,
    dek: raw.dek ?? "",
    excerpt: raw.excerpt || raw.dek || "",
    location: raw.location ?? "",
    publishedAt: raw.publishedAt ?? "",
    author: {
      id: raw.author?._id ?? "unknown",
      name: raw.author?.name ?? "KK Create",
      bio: raw.author?.bio,
      videoUrl: raw.author?.videoUrl,
      avatarUrl: raw.author?.avatar
        ? urlForImage(raw.author.avatar).width(160).height(160).url()
        : undefined,
    },
    cover,
    body,
    tags: raw.tags ?? [],
    videoUrl: raw.videoUrl || raw.author?.videoUrl,
    readMinutes: raw.readMinutes || computeReadMinutes(body, photoCount),
    photoCount,
  };
}

// --- public API ------------------------------------------------------------------

export async function getPhotoEssays(): Promise<PhotoEssay[]> {
  // Imported lazily so the (large) static content stays out of paths that
  // never fall back.
  const { STATIC_PHOTO_ESSAYS } = await import("./photoEssayContent");
  if (!sanityClient) return STATIC_PHOTO_ESSAYS;
  try {
    const docs = await sanityClient.fetch<RawEssay[]>(LIST_QUERY, {}, CACHE);
    return docs?.length ? docs.map(mapEssay) : STATIC_PHOTO_ESSAYS;
  } catch (err) {
    console.error("[photo-essays] Sanity fetch failed — using static fallback:", err);
    return STATIC_PHOTO_ESSAYS;
  }
}

export async function getPhotoEssay(slug: string): Promise<PhotoEssay | null> {
  const { STATIC_PHOTO_ESSAYS } = await import("./photoEssayContent");
  const fallback = () => STATIC_PHOTO_ESSAYS.find((e) => e.slug === slug) ?? null;
  if (!sanityClient) return fallback();
  try {
    const doc = await sanityClient.fetch<RawEssay | null>(SLUG_QUERY, { slug }, CACHE);
    return doc ? mapEssay(doc) : fallback();
  } catch (err) {
    console.error("[photo-essays] Sanity fetch failed — using static fallback:", err);
    return fallback();
  }
}

/** The `count` most recent essays other than `slug` — the "Read next" rail. */
export async function getReadNext(slug: string, count = 2): Promise<PhotoEssay[]> {
  const all = await getPhotoEssays();
  return all.filter((e) => e.slug !== slug).slice(0, count);
}

/**
 * The working version of an essay for the shareable draft preview: the draft
 * if one exists, else the published document. Uses the write-token client
 * (drafts are invisible to the public read client).
 */
export async function getPreviewPhotoEssay(id: string): Promise<PhotoEssay | null> {
  const { sanityWriteClient } = await import("@/sanity/writeClient");
  if (!sanityWriteClient) return null;
  try {
    const docs = await sanityWriteClient.fetch<(RawEssay & { _id: string })[]>(
      `*[_id in [$draft, $published]]{ _id, ${FIELDS} }`,
      { draft: `drafts.${id}`, published: id },
    );
    const doc =
      docs.find((d) => d._id.startsWith("drafts.")) ?? docs[0] ?? null;
    return doc ? mapEssay(doc) : null;
  } catch (err) {
    console.error("[photo-essays] draft preview fetch failed:", err);
    return null;
  }
}

export function formatEssayDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}
