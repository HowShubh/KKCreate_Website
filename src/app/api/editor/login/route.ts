import { NextResponse, type NextRequest } from "next/server";
import {
  EDITOR_COOKIE,
  checkPassword,
  isEditorAuthed,
  isEditorConfigured,
  sessionCookieValue,
} from "@/lib/editorAuth";
import { sanityWriteClient } from "@/sanity/writeClient";

// GET → editor session/config status; POST {password} → sets the session
// cookie; DELETE → logs out.
export async function GET() {
  return NextResponse.json({
    authed: await isEditorAuthed(),
    configured: {
      password: isEditorConfigured(),
      writeToken: Boolean(sanityWriteClient),
    },
  });
}

export async function POST(req: NextRequest) {
  if (!isEditorConfigured()) {
    return NextResponse.json(
      { ok: false, message: "EDITOR_PASSWORD is not set on the server." },
      { status: 503 },
    );
  }
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !checkPassword(password)) {
    return NextResponse.json(
      { ok: false, message: "Wrong password." },
      { status: 401 },
    );
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(EDITOR_COOKIE, sessionCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(EDITOR_COOKIE);
  return res;
}
