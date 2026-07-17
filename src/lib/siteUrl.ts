// Canonical origin for absolute URLs (sitemap, RSS, JSON-LD, OG tags).
// Set NEXT_PUBLIC_SITE_URL in production (e.g. https://kkcreate.com);
// falls back to the Vercel deployment URL, then localhost for dev.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");
