import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

// Server-only read token. This module is only imported by server code
// (src/lib/catalog.ts), and the var has no NEXT_PUBLIC_ prefix, so it is never
// shipped to the browser. Needed because the project restricts anonymous reads.
const token = process.env.SANITY_API_READ_TOKEN;

// `null` until Sanity env is configured — callers fall back to static content.
// next-sanity's client `.fetch` accepts Next cache options ({ next: { tags } }).
export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: !token, // CDN for anonymous reads; direct API when using a token
      perspective: "published", // only published docs reach the public site
      token: token || undefined,
    })
  : null;
