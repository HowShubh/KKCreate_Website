import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isEditorAuthed } from "@/lib/editorAuth";
import { DemoSandbox } from "./DemoSandbox";

export const metadata: Metadata = {
  title: "Editor sandbox",
  robots: { index: false },
};

// Try-the-editor playground for new writers: same editor, in-memory only.
export default async function WriteDemoPage() {
  if (!(await isEditorAuthed())) redirect("/write/login");
  return <DemoSandbox />;
}
