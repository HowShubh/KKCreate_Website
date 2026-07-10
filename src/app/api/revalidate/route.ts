import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

// Sanity webhook target. Configure a webhook (filter: _type == "catalogItem")
// to POST here with ?secret=<SANITY_REVALIDATE_SECRET>. On publish, the
// catalog tag is revalidated so Home / Learn / Catalog reflect the change
// within seconds — no redeploy.
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }
  revalidateTag("catalog");
  return NextResponse.json({ ok: true, revalidated: true, tag: "catalog" });
}
