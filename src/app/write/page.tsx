import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isEditorAuthed } from "@/lib/editorAuth";
import { sanityWriteClient } from "@/sanity/writeClient";
import { EssayList } from "./EssayList";

export const metadata: Metadata = {
  title: "Write",
  robots: { index: false },
};

// Writers' home: every essay (drafts + published) plus "New essay".
export default async function WriteHomePage() {
  if (!(await isEditorAuthed())) redirect("/write/login");

  return (
    <div className="editor-root min-h-screen bg-canvas">
      <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-saffron">
          KK Create · Writers
        </p>
        <h1 className="mt-4 font-essay text-4xl font-semibold text-content md:text-5xl">
          Your essays
        </h1>
        {!sanityWriteClient && (
          <p className="mt-6 rounded-xl border border-saffron/30 bg-saffron/10 p-5 text-sm leading-relaxed text-saffron-dark">
            Writing is read-only right now: add <code>SANITY_API_WRITE_TOKEN</code>{" "}
            (an Editor-role token from sanity.io/manage → API → Tokens) to the
            server&rsquo;s environment to enable saving.
          </p>
        )}
        <EssayList />
      </div>
    </div>
  );
}
