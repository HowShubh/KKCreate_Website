import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

// `null` until Sanity env is configured — callers fall back to static content.
// next-sanity's client `.fetch` accepts Next cache options ({ next: { tags } }).
export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published", // only published docs reach the public site
    })
  : null;
