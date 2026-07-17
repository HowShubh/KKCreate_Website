"use client";

import { EssayEditor } from "@/components/editor/EssayEditor";

// A sandbox for trying the editor: /api/editor requests for the "demo" essay
// are intercepted at module scope (before the editor's first fetch) and served
// from memory. Nothing touches Sanity; a reload starts fresh.

const DEMO_DOC = {
  title: "",
  slug: "",
  dek: "",
  excerpt: "",
  location: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  tags: [],
  videoUrl: "",
  readMinutes: null,
  authorId: null,
  cover: null,
  body: [],
};

if (typeof window !== "undefined" && !("__kkDemoFetch" in window)) {
  (window as unknown as Record<string, unknown>).__kkDemoFetch = true;
  const memory = { doc: { ...DEMO_DOC } as Record<string, unknown> };
  const realFetch = window.fetch.bind(window);

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (!url.includes("/api/editor/")) return realFetch(input, init);

    if (url.includes("/api/editor/authors")) {
      return json({ ok: true, authors: [{ _id: "author.demo", name: "Kavya Karnatac" }] });
    }
    if (url.includes("/api/editor/upload")) {
      return json(
        { ok: false, message: "Uploads are switched off in the sandbox — this is just for trying the editor." },
        503,
      );
    }
    if (url.includes("/api/editor/essays/demo/publish")) {
      return json(
        { ok: false, message: "This is the sandbox — nothing can be published from here." },
        422,
      );
    }
    if (url.includes("/api/editor/essays/demo")) {
      if (init?.method === "PUT") {
        memory.doc = JSON.parse(String(init.body));
        return json({ ok: true, savedAt: new Date().toISOString() });
      }
      return json({ ok: true, doc: memory.doc, hasDraft: true, isPublished: false });
    }
    return realFetch(input, init);
  };
}

export function DemoSandbox() {
  return (
    <>
      <div className="bg-marigold/15 px-5 py-2 text-center text-sm text-content">
        Sandbox — play with the editor freely; nothing is saved or published.
      </div>
      <EssayEditor id="demo" />
    </>
  );
}
