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

/** Extracts the YouTube video id so we can use its own thumbnail. */
function youtubeThumb(url?: string): string {
  if (!url) return "";
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/,
  );
  return m ? `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` : "";
}

export async function getFilmedPlaces(): Promise<FilmedPlace[]> {
  if (!sanityClient) return FILMED_PLACES;
  try {
    const docs = await sanityClient.fetch<PlaceDoc[]>(QUERY, {}, CACHE);
    if (!docs?.length) return FILMED_PLACES;

    return docs
      .filter(
        (d) =>
          typeof d.location?.lat === "number" &&
          typeof d.location?.lng === "number",
      )
      .map((d) => {
        const { x, y } = projectLatLng(d.location!.lat!, d.location!.lng!);
        return {
          id: d._id,
          city: d.city,
          title: d.title,
          views: d.views ?? "",
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
