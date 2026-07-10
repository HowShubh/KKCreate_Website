import { CATALOG, FLAGSHIP, type CatalogItem } from "@/lib/content";
import { sanityClient } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";

// The single source of catalog data for the site. When Sanity is configured it
// reads published documents; otherwise it returns the static content in
// content.ts. This is the ONLY file a future backend swap needs to touch.

type Flagship = typeof FLAGSHIP;

// Raw Sanity document shape (loose — mapped into CatalogItem below).
type CatalogDoc = {
  _id: string;
  title: string;
  type: CatalogItem["type"];
  topic: CatalogItem["topic"];
  description?: string;
  priceAmount?: number;
  duration?: string;
  rating?: number;
  enrolled?: string;
  newlyLaunched?: boolean;
  flagship?: boolean;
  flagshipKicker?: string;
  flagshipPointers?: string[];
  enrollUrl?: string;
  knowMoreUrl?: string;
  image?: Parameters<typeof urlForImage>[0];
};

const FIELDS = `_id, title, type, topic, description, priceAmount, duration,
  rating, enrolled, newlyLaunched, flagship, flagshipKicker, flagshipPointers,
  enrollUrl, knowMoreUrl, image`;

const ITEMS_QUERY = `*[_type == "catalogItem"] | order(coalesce(order, 9999) asc, title asc){ ${FIELDS} }`;
const FLAGSHIP_QUERY = `*[_type == "catalogItem" && flagship == true] | order(_updatedAt desc)[0]{ ${FIELDS} }`;

const CACHE = { next: { tags: ["catalog"], revalidate: 300 } };

function formatPrice(amount?: number): string {
  return `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;
}

function mapItem(doc: CatalogDoc): CatalogItem {
  return {
    id: doc._id,
    title: doc.title,
    type: doc.type,
    topic: doc.topic,
    thumbnail: doc.image
      ? urlForImage(doc.image).width(1200).height(1200).url()
      : "",
    description: doc.description ?? "",
    price: formatPrice(doc.priceAmount),
    duration: doc.duration ?? "",
    rating: doc.rating ?? 0,
    enrolled: doc.enrolled ?? "",
    flagship: doc.flagship || undefined,
    newlyLaunched: doc.newlyLaunched || undefined,
    enrollUrl: doc.enrollUrl ?? "#",
    knowMoreUrl: doc.knowMoreUrl ?? "#",
  };
}

export async function getCatalogItems(): Promise<CatalogItem[]> {
  if (!sanityClient) return CATALOG;
  try {
    const docs = await sanityClient.fetch<CatalogDoc[]>(ITEMS_QUERY, {}, CACHE);
    return docs?.length ? docs.map(mapItem) : CATALOG;
  } catch (err) {
    console.error("[catalog] Sanity fetch failed — using static fallback:", err);
    return CATALOG;
  }
}

export async function getFlagship(): Promise<Flagship> {
  if (!sanityClient) return FLAGSHIP;
  try {
    const doc = await sanityClient.fetch<CatalogDoc | null>(FLAGSHIP_QUERY, {}, CACHE);
    if (!doc) return FLAGSHIP;
    return {
      id: doc._id,
      title: doc.title,
      kicker: doc.flagshipKicker ?? "Flagship Course",
      pointers: doc.flagshipPointers ?? [],
      price: formatPrice(doc.priceAmount),
      thumbnail: doc.image
        ? urlForImage(doc.image).width(1200).url()
        : FLAGSHIP.thumbnail,
      enrollUrl: doc.enrollUrl ?? "#",
      knowMoreUrl: doc.knowMoreUrl ?? "#",
    };
  } catch (err) {
    console.error("[catalog] Sanity flagship fetch failed — using static fallback:", err);
    return FLAGSHIP;
  }
}
