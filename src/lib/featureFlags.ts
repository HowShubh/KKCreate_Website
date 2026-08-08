// Build-time feature flags.
//
// PHOTO_ESSAYS_LIVE gates the public photo-essay section while its content and
// design are still being worked out. When it's off:
//   - /photo-essays renders a "coming soon" banner instead of the listing
//   - /photo-essays/<slug> 404s
//   - the section is left out of sitemap.xml, feed.xml and llms.txt
//
// The private writers' area (/write) and draft previews are NOT gated — they're
// password-protected and disallowed in robots.txt, so writers can keep drafting
// ahead of launch.
//
// To work on the section, set NEXT_PUBLIC_PHOTO_ESSAYS_LIVE=true in .env.local.
// To launch, set it in the host's env and redeploy — NEXT_PUBLIC_ values are
// inlined at build time, so a rebuild is required for the flip to take effect.
export const PHOTO_ESSAYS_LIVE =
  process.env.NEXT_PUBLIC_PHOTO_ESSAYS_LIVE === "true";
