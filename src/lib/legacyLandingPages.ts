// Landing pages that lived on kkcreate.in while the domain pointed at Tag
// Mango. Most now live on the lp.kkcreate.in subdomain, but their old links
// are already out in reels, WhatsApp groups and DMs, so next.config.ts
// redirects each old path to its Tag Mango twin.
//
// The content creation workshop is the exception. It was relaunched on its
// own subdomain, so its two landing pages redirect there instead; see
// CONTENT_CREATION_WORKSHOP_URL below.
//
// Rules for these lists:
//   - One entry per page that exists at the destination. Nothing speculative:
//     a slug here that 404s is worse than no redirect.
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

  // Content creation workshop — thank-you pages only. The landing pages
  // themselves moved to the relaunched workshop (CONTENT_CREATION_LP_SLUGS).
  // These stay on Tag Mango because the new workshop runs its own funnel on
  // its own subdomain, and the old thank-you pages only matter to people who
  // registered through the old one.
  "typage",
  "ccw-typage",

  // Finance workshop
  "financeworkshop",
  "finance-typage",

  // Standalone pages
  "meetinglink",
  "cjuo",
] as const;

/**
 * The relaunched content creation workshop, on its own subdomain.
 *
 * Google has the old kkcreate.in landing pages indexed, so both of them
 * point here to hand that ranking to the new page instead of to the retired
 * Tag Mango copy. Trailing slash on purpose: Next.js appends the forwarded
 * query string directly, so this yields `.../?utm_source=…` rather than
 * `...in?utm_source=…`.
 */
export const CONTENT_CREATION_WORKSHOP_URL =
  "https://contentcreation.kkcreate.in/";

/** Old kkcreate.in paths for the content creation workshop landing page. */
export const CONTENT_CREATION_LP_SLUGS = [
  "contentcreation",
  "content-creation",
] as const;

/**
 * Next.js redirect entries for every retired landing page.
 *
 * Query strings are not repeated in the destination on purpose: Next.js
 * forwards the incoming query to the destination automatically as long as
 * the destination declares none of its own. That is what keeps `?utm_source`
 * and `fbclid` attached across the hop, so the destination still sees where
 * the click came from.
 */
export function legacyLandingPageRedirects() {
  const tagMango = LEGACY_LP_SLUGS.map((slug) => ({
    source: `/${slug}`,
    destination: `${LEGACY_LP_ORIGIN}/${slug}`,
    // 307 while the cutover is fresh. A permanent redirect is cached by the
    // browser more or less forever, so a wrong slug would be unfixable for
    // anyone who hit it once. Flip to `true` (308) once these are verified
    // in production and the list has stopped changing.
    permanent: false,
  }));

  const contentCreation = CONTENT_CREATION_LP_SLUGS.map((slug) => ({
    source: `/${slug}`,
    destination: CONTENT_CREATION_WORKSHOP_URL,
    // Permanent on purpose. A temporary redirect tells Google to keep the
    // old URL indexed; 308 is what makes it drop the old page and index the
    // new one. The destination is the subdomain root, not a slug that could
    // be mistyped, so the "unfixable cache" worry above doesn't apply.
    permanent: true,
  }));

  return [...tagMango, ...contentCreation];
}
