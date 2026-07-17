import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isEditorAuthed } from "@/lib/editorAuth";
import { EssayEditor } from "@/components/editor/EssayEditor";

export const metadata: Metadata = {
  title: "Write",
  robots: { index: false },
};

export default async function WriteEssayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isEditorAuthed())) redirect("/write/login");
  const { id } = await params;
  return <EssayEditor id={decodeURIComponent(id)} />;
}
