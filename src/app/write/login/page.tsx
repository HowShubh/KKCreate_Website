import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isEditorAuthed, isEditorConfigured } from "@/lib/editorAuth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in to write",
  robots: { index: false },
};

export default async function WriteLoginPage() {
  if (await isEditorAuthed()) redirect("/write");
  const configured = isEditorConfigured();

  return (
    <div className="editor-root flex min-h-screen items-center justify-center bg-canvas px-5">
      <div className="w-full max-w-sm">
        <p className="text-center font-mono text-xs uppercase tracking-[0.18em] text-saffron">
          KK Create · Writers
        </p>
        <h1 className="mt-4 text-center font-essay text-4xl font-semibold text-content">
          Sign in to write
        </h1>
        {configured ? (
          <LoginForm />
        ) : (
          <p className="mt-6 rounded-xl border border-hairline bg-card p-5 text-sm leading-relaxed text-content-soft">
            The editor isn&rsquo;t set up yet — add <code>EDITOR_PASSWORD</code>{" "}
            (and <code>SANITY_API_WRITE_TOKEN</code>) to the server&rsquo;s
            environment, then reload this page.
          </p>
        )}
      </div>
    </div>
  );
}
