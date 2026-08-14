import { cache } from "react";
import { SITE } from "@/lib/content";
import { sanityClient } from "@/sanity/client";
import type { SocialName } from "@/components/SocialIcon";

// Reads the "Site Settings" singleton from Sanity, falling back to the static
// SITE defaults when Sanity is unconfigured or empty. Mirrors src/lib/catalog.ts.

export type ThemeChoice = "light" | "dark" | "system";

export type SiteSettings = {
  defaultTheme: ThemeChoice;
  platforms: { name: string; icon: SocialName; href: string }[];
  contacts: {
    brands: string;
    creators: string;
    careers: string;
    /** External openings page. Empty means fall back to the careers email. */
    careersUrl?: string;
  };
};

/**
 * Where "Careers" points and what it's called. Derived in one place so the
 * contact card and the footer always show the identical call to action —
 * the openings page once it's set in Sanity, the careers email until then.
 */
export function careersLink(contacts: SiteSettings["contacts"]) {
  return contacts.careersUrl
    ? { href: contacts.careersUrl, label: "See open roles", external: true }
    : {
        href: `mailto:${contacts.careers}`,
        label: "See how to apply",
        external: false,
      };
}

const LABELS: Record<SocialName, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

const QUERY = `*[_type == "siteSettings"][0]{
  defaultTheme,
  "social": social[]{ platform, url },
  contacts
}`;

const CACHE = { next: { tags: ["settings"], revalidate: 300 } };

type SettingsDoc = {
  defaultTheme?: ThemeChoice;
  social?: { platform?: SocialName; url?: string }[];
  contacts?: {
    brands?: string;
    creators?: string;
    careers?: string;
    careersUrl?: string;
  };
};

const FALLBACK: SiteSettings = {
  defaultTheme: "system",
  platforms: SITE.platforms.map((p) => ({
    name: p.name,
    icon: p.icon,
    href: p.href,
  })),
  contacts: { ...SITE.contacts },
};

// cache() dedupes the fetch across the layout, home page and footer per request.
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!sanityClient) return FALLBACK;
  try {
    const doc = await sanityClient.fetch<SettingsDoc | null>(QUERY, {}, CACHE);
    if (!doc) return FALLBACK;

    const platforms = (doc.social ?? [])
      .filter(
        (s): s is { platform: SocialName; url: string } =>
          Boolean(s?.platform && s?.url),
      )
      .map((s) => ({
        name: LABELS[s.platform] ?? s.platform,
        icon: s.platform,
        href: s.url,
      }));

    return {
      defaultTheme: doc.defaultTheme ?? FALLBACK.defaultTheme,
      platforms: platforms.length ? platforms : FALLBACK.platforms,
      contacts: {
        brands: doc.contacts?.brands || FALLBACK.contacts.brands,
        creators: doc.contacts?.creators || FALLBACK.contacts.creators,
        careers: doc.contacts?.careers || FALLBACK.contacts.careers,
        careersUrl: doc.contacts?.careersUrl || undefined,
      },
    };
  } catch (err) {
    console.error(
      "[settings] Sanity fetch failed — using static fallback:",
      err,
    );
    return FALLBACK;
  }
});
