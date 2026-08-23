// Tags outbound store links (pay./learn.kkcreate.in) with UTM parameters so a
// sale can be attributed back to this website — and to the specific card that
// drove it. The store lives on other subdomains, so the query string is the
// only signal that survives the hop; without it every referral looks the same.
//
// Read in analytics as:
//   utm_source   → always "kkcreate.in" (this site sent the visitor)
//   utm_medium   → always "website"
//   utm_campaign → where on the site they clicked ("catalog", "flagship")
//   utm_content  → which product (the URL slug, e.g. "youtube-100k")

type UtmOpts = {
  campaign: string; // placement on the site: "catalog", "flagship", …
  content?: string; // overrides the auto-derived product slug
};

const SOURCE = "kkcreate.in";
const MEDIUM = "website";

export function withUtm(rawUrl: string, { campaign, content }: UtmOpts): string {
  if (!rawUrl || rawUrl === "#") return rawUrl;

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return rawUrl; // relative or malformed — leave it untouched
  }

  // Last path segment identifies the product, e.g. …/youtube-100k. When the
  // link is a bare subdomain root (editing101.kkcreate.in/), fall back to the
  // leftmost host label so that card is still attributable on its own.
  const slug =
    url.pathname.split("/").filter(Boolean).pop() ||
    url.hostname.split(".").filter((l) => l !== "www")[0] ||
    "";

  const params: Record<string, string> = {
    utm_source: SOURCE,
    utm_medium: MEDIUM,
    utm_campaign: campaign,
  };
  const item = content ?? slug;
  if (item) params.utm_content = item;

  // Never clobber UTMs an editor may have set on the link in Sanity.
  for (const [key, value] of Object.entries(params)) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, value);
  }

  return url.toString();
}
