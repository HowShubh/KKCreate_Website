import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

// Server-only client for the /write editor. Uses a token with write access
// (Editor role) — create at sanity.io/manage → API → Tokens. The var has no
// NEXT_PUBLIC_ prefix and this module is only imported from API routes, so
// the token never reaches the browser.
//
// `perspective: "raw"` because the editor works with draft documents
// (`drafts.<id>`) directly.
const token = process.env.SANITY_API_WRITE_TOKEN;

export const sanityWriteClient =
  isSanityConfigured && token
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        token,
        useCdn: false,
        perspective: "raw",
      })
    : null;
