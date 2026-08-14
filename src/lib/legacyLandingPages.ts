// Landing pages that lived on kkcreate.in while the domain pointed at Tag
// Mango. They now live on the lp.kkcreate.in subdomain, but their old links
// are already out in reels, WhatsApp groups and DMs, so next.config.ts
// redirects each old path to its Tag Mango twin.
//
// Rules for this list:
//   - One entry per page that exists in Tag Mango. Nothing speculative:
//     a slug here that 404s on lp.kkcreate.in is worse than no redirect.
//   - These slugs are retired. Never add a route under src/app that reuses
//     one, or the redirect will shadow it.
//   - The Tag Mango root page ("KK Create") is deliberately absent — "/" is
//     the new site's home page now.

export const LEGACY_LP_ORIGIN = "https://lp.kkcreate.in";

/**
 * Old kkcreate.in paths, which are also the paths they keep on
 * lp.kkcreate.in. Grouped by workshop to make the pairs obvious; a workshop
 * page and its thank-you page have to move together or the funnel breaks
 * halfway through.
 */
export const LEGACY_LP_SLUGS = [
  // AI workshop, three generations of it
  "aiworkshop",
  "ai-thankyou",
  "ai-workshop",
  "ai-workshop-typage",
  "aiworkshop-v1",
  "aiworkshop-v1-typage",

  // YouTube workshop
  "youtube101",
  "yt-typage",
  "yt101-workshop",
  "yt101-thankyou",

  // Content creation workshop
  "contentcreation",
  "typage",
  "content-creation",
  "ccw-typage",

  // Finance workshop
  "financeworkshop",
  "finance-typage",

  // Standalone pages
  "meetinglink",
  "cjuo",
] as const;

/**
 * Next.js redirect entries for every retired landing page.
 *
 * Query strings are not repeated in the destination on purpose: Next.js
 * forwards the incoming query to the destination automatically as long as
 * the destination declares none of its own. That is what keeps `?utm_source`
 * and `fbclid` attached across the hop, so Tag Mango still sees where the
 * click came from.
 */
export function legacyLandingPageRedirects() {
  return LEGACY_LP_SLUGS.map((slug) => ({
    source: `/${slug}`,
    destination: `${LEGACY_LP_ORIGIN}/${slug}`,
    // 307 while the cutover is fresh. A permanent redirect is cached by the
    // browser more or less forever, so a wrong slug would be unfixable for
    // anyone who hit it once. Flip to `true` (308) once these are verified
    // in production and the list has stopped changing.
    permanent: false,
  }));
}
