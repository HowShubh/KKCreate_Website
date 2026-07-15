import { FILMED_PLACES, type FilmedPlace } from "@/lib/content";
import { projectLatLng } from "@/lib/india-projection";
import { sanityClient } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";

// Pins for the home "Where we've filmed" map. Reads filmedPlace documents
// from Sanity (locations picked on the Studio's India map) and projects each
// geopoint into the map's x/y space; falls back to the static demo pins.

type PlaceDoc = {
  _id: string;
  city: string;
  title: string;
  views?: string;
  url?: string;
  location?: { lat?: number; lng?: number };
  thumbnail?: Parameters<typeof urlForImage>[0];
};

const QUERY = `*[_type == "filmedPlace"] | order(city asc){
  _id, city, title, views, url, location, thumbnail
}`;

const CACHE = { next: { tags: ["filmed-places"], revalidate: 300 } };

/** Extracts the YouTube video id from any common YouTube URL form. */
function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/,
  );
  return m ? m[1] : null;
}

function youtubeThumb(url?: string): string {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/**
 * Live view counts for places whose `views` field is empty. Needs a
 * YOUTUBE_API_KEY env var (YouTube Data API v3); silently returns nothing
 * without one, so the field just stays blank. One batched request covers
 * up to 50 videos and is cached alongside the places (5 min).
 */
async function fetchViews(ids: string[]): Promise<Record<string, string>> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key || !ids.length) return {};
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids
        .slice(0, 50)
        .join(",")}&key=${key}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) throw new Error(`YouTube API ${res.status}`);
    const data = (await res.json()) as {
      items?: { id: string; statistics?: { viewCount?: string } }[];
    };
    const views: Record<string, string> = {};
    for (const item of data.items ?? []) {
      const n = Number(item.statistics?.viewCount);
      if (Number.isFinite(n) && n > 0)
        views[item.id] = `${compactNumber.format(n)} views`;
    }
    return views;
  } catch (err) {
    console.error("[filmed-places] YouTube views fetch failed:", err);
    return {};
  }
}

export async function getFilmedPlaces(): Promise<FilmedPlace[]> {
  if (!sanityClient) return FILMED_PLACES;
  try {
    const docs = await sanityClient.fetch<PlaceDoc[]>(QUERY, {}, CACHE);
    if (!docs?.length) return FILMED_PLACES;

    const placed = docs.filter(
      (d) =>
        typeof d.location?.lat === "number" &&
        typeof d.location?.lng === "number",
    );

    // Auto-fill empty views from YouTube (one batched request, key-gated).
    const missingIds = placed
      .filter((d) => !d.views)
      .map((d) => youtubeId(d.url))
      .filter((id): id is string => Boolean(id));
    const liveViews = await fetchViews([...new Set(missingIds)]);

    return placed.map((d) => {
      const { x, y } = projectLatLng(d.location!.lat!, d.location!.lng!);
      const vid = youtubeId(d.url);
      return {
        id: d._id,
        city: d.city,
        title: d.title,
        views: d.views || (vid ? (liveViews[vid] ?? "") : ""),
        url: d.url ?? "#",
        thumbnail: d.thumbnail
          ? urlForImage(d.thumbnail).width(640).height(360).url()
          : youtubeThumb(d.url),
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
      };
    });
  } catch (err) {
    console.error(
      "[filmed-places] Sanity fetch failed — using static fallback:",
      err,
    );
    return FILMED_PLACES;
  }
}
