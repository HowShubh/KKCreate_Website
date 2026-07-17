import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

// Sanity webhook target. Configure webhooks to POST here with
// ?secret=<SANITY_REVALIDATE_SECRET>. On publish the matching cache tag is
// revalidated so the site reflects the change within seconds — no redeploy.
//
//   _type == "catalogItem"              → catalog       (Home / Learn / Catalog)
//   _type in ["photoEssay", "author"]   → photo-essays  (listing + essay pages)
//
// The webhook body isn't needed — both tags are revalidated on every call,
// which keeps the Sanity webhook config to a single hook if preferred.
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }
  const tags = ["catalog", "photo-essays"];
  tags.forEach(revalidateTag);
  return NextResponse.json({ ok: true, revalidated: true, tags });
}
