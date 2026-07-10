// Sanity connection values, read from env. Kept tolerant of "not configured"
// so the site falls back to static content until keys are added.
// NEXT_PUBLIC_* is what Next inlines; SANITY_STUDIO_* is what the Sanity CLI
// (Vite) injects when running/deploying the Studio — set both to the same value.

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  "";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  "production";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

/** True once a real Sanity project id is present. Drives the static fallback. */
export const isSanityConfigured = Boolean(projectId);
