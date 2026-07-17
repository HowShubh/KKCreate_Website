import { NextResponse, type NextRequest } from "next/server";
import { requireEditor } from "@/lib/editorApi";

// GET → authors for the byline picker; POST {name} → quick-create an author.
export async function GET() {
  const guard = await requireEditor();
  if (guard.error) return guard.error;

  const authors = await guard.client.fetch<
    { _id: string; name: string }[]
  >(`*[_type == "author" && !(_id in path("drafts.**"))] | order(name asc){ _id, name }`);
  return NextResponse.json({ ok: true, authors });
}

export async function POST(req: NextRequest) {
  const guard = await requireEditor();
  if (guard.error) return guard.error;

  const { name } = await req.json().catch(() => ({}));
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { ok: false, message: "Give the author a name." },
      { status: 400 },
    );
  }

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const doc = await guard.client.createIfNotExists({
    _id: `author.${slug}`,
    _type: "author",
    name: name.trim(),
  });
  return NextResponse.json({ ok: true, author: { _id: doc._id, name: doc.name } });
}
