import { NextResponse, type NextRequest } from "next/server";
import { requireEditor } from "@/lib/editorApi";
import { urlForImage } from "@/sanity/image";

// POST multipart/form-data { file } → uploads the image to Sanity's asset
// store, returns the asset reference plus a render URL for the editor.
export async function POST(req: NextRequest) {
  const guard = await requireEditor();
  if (guard.error) return guard.error;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json(
      { ok: false, message: "Attach an image file." },
      { status: 400 },
    );
  }
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json(
      { ok: false, message: "Image is larger than 20 MB." },
      { status: 413 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await guard.client.assets.upload("image", buffer, {
    filename: file.name,
    contentType: file.type,
  });

  return NextResponse.json({
    ok: true,
    assetId: asset._id,
    url: urlForImage({ asset: { _ref: asset._id } })
      .width(2000)
      .url(),
  });
}
