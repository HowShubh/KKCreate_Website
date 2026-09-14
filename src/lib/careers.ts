import { cache } from "react";
import { sanityClient } from "@/sanity/client";

// Open roles for /careers, read from published jobOpening documents. Unlike
// the catalog there is no static stand-in: with Sanity unconfigured (or no
// roles published) the page shows its "nothing open right now" state rather
// than a made-up listing.

export type JobOpening = {
  id: string;
  title: string;
  location?: string;
  /** Optional one-liner shown under the role. */
  description?: string;
  /** The application form — a Google Form today. */
  applyUrl: string;
};

type OpeningDoc = {
  _id: string;
  title?: string;
  location?: string;
  description?: string;
  applyUrl?: string;
};

// Newest first, so a freshly posted role sits at the top of the list.
const QUERY = `*[_type == "jobOpening"] | order(_createdAt desc){
  _id, title, location, description, applyUrl
}`;

const CACHE = { next: { tags: ["careers"], revalidate: 300 } };

// cache() dedupes the fetch if the list is ever read twice in one request.
export const getJobOpenings = cache(async (): Promise<JobOpening[]> => {
  if (!sanityClient) return [];
  try {
    const docs = await sanityClient.fetch<OpeningDoc[]>(QUERY, {}, CACHE);
    return (docs ?? [])
      // A role without a title or a form to send people to isn't listable.
      .filter(
        (d): d is OpeningDoc & { title: string; applyUrl: string } =>
          Boolean(d?.title && d?.applyUrl),
      )
      .map((d) => ({
        id: d._id,
        title: d.title,
        location: d.location || undefined,
        description: d.description || undefined,
        applyUrl: d.applyUrl,
      }));
  } catch (err) {
    console.error("[careers] Sanity fetch failed — listing no roles:", err);
    return [];
  }
});
