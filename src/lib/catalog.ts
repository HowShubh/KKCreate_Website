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

// Baseline order: the legacy per-item `order` number. The field is gone from
// the Studio, but the values live on in existing documents, so the site keeps
// its current order until the "Catalog order" list is filled in.
const ITEMS_QUERY = `*[_type == "catalogItem"] | order(coalesce(order, 9999) asc, title asc){ ${FIELDS} }`;
// Display order proper lives in the drag-to-reorder "Catalog order" document.
// GROQ can't sort by an array's position, so fetch the ids and apply below.
const ORDER_QUERY = `*[_type == "catalogOrder"][0].items[]._ref`;
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

// Sort by position in the editor's ordered list. Items missing from it (a newly
// created one, say) hold their baseline position at the end rather than
// vanishing or jumping to the front. A draft id resolves to its published id so
// the order still applies while an item is being edited.
function applyOrder(items: CatalogItem[], order: string[]): CatalogItem[] {
  if (!order.length) return items;
  const rank = new Map(order.map((id, i) => [id, i]));
  const rankOf = (id: string) =>
    rank.get(id) ?? rank.get(id.replace(/^drafts\./, "")) ?? Number.MAX_SAFE_INTEGER;
  return [...items].sort((a, b) => rankOf(a.id) - rankOf(b.id));
}

export async function getCatalogItems(): Promise<CatalogItem[]> {
  if (!sanityClient) return CATALOG;
  try {
    const [docs, order] = await Promise.all([
      sanityClient.fetch<CatalogDoc[]>(ITEMS_QUERY, {}, CACHE),
      sanityClient.fetch<string[] | null>(ORDER_QUERY, {}, CACHE),
    ]);
    if (!docs?.length) return CATALOG;
    return applyOrder(docs.map(mapItem), order ?? []);
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
