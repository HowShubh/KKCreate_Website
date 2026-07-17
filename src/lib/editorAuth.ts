import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Session for the /write editor: one shared password (EDITOR_PASSWORD env),
// exchanged for an httpOnly cookie holding an HMAC derived from the password.
// Server-only — imported by API routes and server components.

export const EDITOR_COOKIE = "kk-editor-session";

function sessionToken(): string | null {
  const password = process.env.EDITOR_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", "kk-editor-v1").update(password).digest("hex");
}

export function isEditorConfigured(): boolean {
  return Boolean(process.env.EDITOR_PASSWORD);
}

export function checkPassword(candidate: string): boolean {
  const password = process.env.EDITOR_PASSWORD;
  if (!password) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(password);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Cookie value handed out after a correct password. */
export function sessionCookieValue(): string {
  return sessionToken() ?? "";
}

export async function isEditorAuthed(): Promise<boolean> {
  const expected = sessionToken();
  if (!expected) return false;
  const store = await cookies();
  return store.get(EDITOR_COOKIE)?.value === expected;
}

/**
 * Deterministic secret for a draft-preview link (`/photo-essays/preview/…`).
 * Derived from EDITOR_PASSWORD, so links stay valid until the password
 * changes and nothing needs to be stored. Anyone holding the link can view
 * that one draft — that's the point (reviewers don't need the password).
 */
export function previewToken(id: string): string | null {
  const password = process.env.EDITOR_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", `kk-preview-v1:${password}`)
    .update(id)
    .digest("hex")
    .slice(0, 32);
}

export function isValidPreviewToken(id: string, token: string): boolean {
  const expected = previewToken(id);
  if (!expected || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
