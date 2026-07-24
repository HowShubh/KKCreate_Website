import { cache } from "react";
import { sanityClient } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";

// Reads the "Learn — Formats section" singleton (podcasts + reels stacks) from
// Sanity, falling back to static defaults when Sanity is unconfigured or empty.
// Mirrors src/lib/settings.ts. This is the only file the Learn page's
// "However you learn" section reads from.

export type LearnVideo = {
  title: string;
  views: string;
  url: string;
  /** Resolved image URL, or "" to render a plain textured frame. */
  thumbnail: string;
};

export type LearnFormat = {
  kicker: string;
  heading: string;
  description: string;
  linkLabel: string;
  linkUrl: string;
  videos: LearnVideo[];
};

export type LearnFormats = {
  sectionHeading: string;
  sectionHeadingAccent: string;
  podcast: LearnFormat;
  reels: LearnFormat;
};

const FALLBACK: LearnFormats = {
  sectionHeading: "However you learn,",
  sectionHeadingAccent: "we’re already there",
  podcast: {
    kicker: "Got an hour?",
    heading: "Podcasts with creators",
    description: "conversations that help you learn content and distribution",
    linkLabel: "Podcasts",
    linkUrl: "https://youtube.com/@kk.create",
    videos: [
      {
        title: "Dhruv Rathee, Part 2",
        views: "1.4M views",
        url: "https://youtube.com/@kk.create",
        thumbnail: "/what-we-do/podcast.jpg",
      },
    ],
  },
  reels: {
    kicker: "Got 90 seconds?",
    heading: "Daily lessons for creators",
    description: "short-form videos that teach content creation and distribution",
    linkLabel: "Reels",
    linkUrl: "https://instagram.com/kk.create",
    videos: [
      {
        title: "The caption formula we use every day",
        views: "2.1M views",
        url: "https://instagram.com/kk.create",
        thumbnail: "",
      },
    ],
  },
};

type VideoDoc = {
  title?: string;
  views?: string;
  url?: string;
  thumbnail?: Parameters<typeof urlForImage>[0];
};

type FormatDoc = {
  kicker?: string;
  heading?: string;
  description?: string;
  linkLabel?: string;
  linkUrl?: string;
  videos?: VideoDoc[];
};

type FormatsDoc = {
  sectionHeading?: string;
  sectionHeadingAccent?: string;
  podcast?: FormatDoc;
  reels?: FormatDoc;
};

const VIDEO_FIELDS = `title, views, url, thumbnail`;
const FORMAT_FIELDS = `kicker, heading, description, linkLabel, linkUrl,
  videos[]{ ${VIDEO_FIELDS} }`;

const QUERY = `*[_type == "learnFormats"][0]{
  sectionHeading,
  sectionHeadingAccent,
  podcast{ ${FORMAT_FIELDS} },
  reels{ ${FORMAT_FIELDS} }
}`;

const CACHE = { next: { tags: ["learn-formats"], revalidate: 300 } };

// Reels are portrait (9:16), podcasts landscape (16:9); crop each to suit.
function mapVideos(docs: VideoDoc[] | undefined, portrait: boolean): LearnVideo[] {
  return (docs ?? [])
    .filter((v): v is VideoDoc & { title: string; url: string } =>
      Boolean(v?.title && v?.url),
    )
    .map((v) => ({
      title: v.title,
      views: v.views ?? "",
      url: v.url,
      thumbnail: v.thumbnail
        ? portrait
          ? urlForImage(v.thumbnail).width(720).height(1280).url()
          : urlForImage(v.thumbnail).width(1280).height(720).url()
        : "",
    }));
}

function mapFormat(
  doc: FormatDoc | undefined,
  fallback: LearnFormat,
  portrait: boolean,
): LearnFormat {
  const videos = mapVideos(doc?.videos, portrait);
  return {
    kicker: doc?.kicker || fallback.kicker,
    heading: doc?.heading || fallback.heading,
    description: doc?.description || fallback.description,
    linkLabel: doc?.linkLabel || fallback.linkLabel,
    linkUrl: doc?.linkUrl || fallback.linkUrl,
    videos: videos.length ? videos : fallback.videos,
  };
}

// cache() dedupes the fetch if the section ever renders more than once/request.
export const getLearnFormats = cache(async (): Promise<LearnFormats> => {
  if (!sanityClient) return FALLBACK;
  try {
    const doc = await sanityClient.fetch<FormatsDoc | null>(QUERY, {}, CACHE);
    if (!doc) return FALLBACK;
    return {
      sectionHeading: doc.sectionHeading || FALLBACK.sectionHeading,
      sectionHeadingAccent:
        doc.sectionHeadingAccent || FALLBACK.sectionHeadingAccent,
      podcast: mapFormat(doc.podcast, FALLBACK.podcast, false),
      reels: mapFormat(doc.reels, FALLBACK.reels, true),
    };
  } catch (err) {
    console.error(
      "[learn-formats] Sanity fetch failed — using static fallback:",
      err,
    );
    return FALLBACK;
  }
});
