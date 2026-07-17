"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EditorProvider,
  PortableTextEditable,
  useEditor,
  type BlockRenderProps,
  type PortableTextBlock,
  type RenderAnnotationFunction,
  type RenderBlockFunction,
  type RenderDecoratorFunction,
  type RenderPlaceholderFunction,
} from "@portabletext/editor";
import { ESSAY_STYLES } from "@/lib/essayStyles";
import type { EditorEssayDoc } from "@/lib/editorApi";
import {
  EditorImageBlock,
  EditorImagePairBlock,
  EditorSocialEmbedBlock,
  EditorYoutubeBlock,
  ImageSlot,
} from "./editorBlocks";
import { EditorToolbar } from "./EditorToolbar";
import { PlusMenu } from "./PlusMenu";
import { detectEmbed } from "@/components/SocialEmbed";
import {
  api,
  ApiError,
  bodyStats,
  editorSchemaDefinition,
  normalizeBody,
  slugify,
  youtubeId,
} from "./editorUtils";
import { keyGenerator, type OnPasteFn } from "@portabletext/editor";

type Author = { _id: string; name: string };
type SaveState = "saved" | "dirty" | "saving" | "error";

// The Medium-style essay editor: the page IS the essay design; writers type
// into it directly. Body content lives inside the Portable Text Editor;
// everything else (title, dek, byline, cover, settings) is plain React state.
// Both funnel into one autosaved draft document.
export function EssayEditor({ id }: { id: string }) {
  const [doc, setDoc] = useState<EditorEssayDoc | null>(null);
  const [initialBody, setInitialBody] = useState<PortableTextBlock[] | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [flags, setFlags] = useState({ hasDraft: false, isPublished: false });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [essay, authorsRes] = await Promise.all([
          api<{
            doc: EditorEssayDoc;
            hasDraft: boolean;
            isPublished: boolean;
            previewUrl: string | null;
          }>(`/api/editor/essays/${encodeURIComponent(id)}`),
          api<{ authors: Author[] }>("/api/editor/authors"),
        ]);
        if (cancelled) return;
        setDoc(essay.doc);
        setInitialBody(normalizeBody(essay.doc.body));
        setFlags({ hasDraft: essay.hasDraft, isPublished: essay.isPublished });
        setPreviewUrl(essay.previewUrl ?? null);
        setAuthors(authorsRes.authors);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          window.location.href = "/write/login";
          return;
        }
        setLoadError(err instanceof Error ? err.message : "Failed to load.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loadError) {
    return (
      <EditorFrame>
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <p className="font-essay text-2xl text-content">Can&rsquo;t open this essay</p>
          <p className="mt-3 text-content-soft">{loadError}</p>
          <Link href="/write" className="mt-6 inline-block font-semibold text-saffron">
            ← Back to essays
          </Link>
        </div>
      </EditorFrame>
    );
  }
  if (!doc || !initialBody) {
    return (
      <EditorFrame>
        <div className="px-5 py-24 text-center font-mono text-sm text-content-soft">
          Opening the essay…
        </div>
      </EditorFrame>
    );
  }

  return (
    <EditorFrame>
      <EditorProvider
        initialConfig={{
          schemaDefinition: editorSchemaDefinition,
          initialValue: initialBody,
        }}
      >
        <EditorInner
          id={id}
          initialDoc={doc}
          initialBody={initialBody}
          authors={authors}
          setAuthors={setAuthors}
          flags={flags}
          setFlags={setFlags}
          previewUrl={previewUrl}
        />
      </EditorProvider>
    </EditorFrame>
  );
}

/** Marker class hides the public navbar/footer (see globals.css). */
function EditorFrame({ children }: { children: React.ReactNode }) {
  return <div className="editor-root min-h-screen bg-canvas">{children}</div>;
}

function EditorInner({
  id,
  initialDoc,
  initialBody,
  authors,
  setAuthors,
  flags,
  setFlags,
  previewUrl,
}: {
  id: string;
  initialDoc: EditorEssayDoc;
  initialBody: PortableTextBlock[];
  authors: Author[];
  setAuthors: (a: Author[]) => void;
  flags: { hasDraft: boolean; isPublished: boolean };
  setFlags: (f: { hasDraft: boolean; isPublished: boolean }) => void;
  previewUrl: string | null;
}) {
  const editor = useEditor();
  const [meta, setMeta] = useState(initialDoc);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [notice, setNotice] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [stats, setStats] = useState(() => bodyStats(initialBody));

  const bodyRef = useRef<PortableTextBlock[]>(initialBody);
  const metaRef = useRef(meta);
  metaRef.current = meta;
  const slugTouched = useRef(
    Boolean(initialDoc.slug) && initialDoc.slug !== slugify(initialDoc.title),
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSave = useCallback(async () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    setSaveState("saving");
    try {
      await api(`/api/editor/essays/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify({ ...metaRef.current, body: bodyRef.current }),
      });
      setSaveState("saved");
      setNotice(null);
      setFlags({ ...flags, hasDraft: true });
    } catch (err) {
      setSaveState("error");
      if (err instanceof ApiError && err.status === 401) {
        window.location.href = "/write/login";
        return;
      }
      setNotice(err instanceof Error ? err.message : "Saving failed.");
    }
  }, [id, flags, setFlags]);

  const scheduleSave = useCallback(() => {
    setSaveState("dirty");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(doSave, 1200);
  }, [doSave]);

  // Body edits stream in from the editor.
  useEffect(() => {
    const sub = editor.on("mutation", (event) => {
      bodyRef.current = event.value ?? [];
      setStats(bodyStats(bodyRef.current));
      scheduleSave();
    });
    return () => sub.unsubscribe();
  }, [editor, scheduleSave]);

  // Don't let a closing tab eat unsaved work.
  const saveStateRef = useRef(saveState);
  saveStateRef.current = saveState;
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (saveStateRef.current === "dirty" || saveStateRef.current === "saving") {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  // Medium-style paste: a bare tweet / Instagram / YouTube link becomes an
  // embed block instead of plain text.
  const handlePaste: OnPasteFn = useCallback((data) => {
    const text = data.event.clipboardData?.getData("text/plain")?.trim() ?? "";
    if (!/^https?:\/\/\S+$/.test(text)) return undefined;
    if (detectEmbed(text)) {
      return {
        insert: [{ _type: "socialEmbed", _key: keyGenerator(), url: text }],
      };
    }
    if (youtubeId(text)) {
      return {
        insert: [{ _type: "youtube", _key: keyGenerator(), url: text }],
      };
    }
    return undefined;
  }, []);

  const updateMeta = useCallback(
    (patch: Partial<EditorEssayDoc>) => {
      setMeta((m) => {
        const next = { ...m, ...patch };
        if (
          patch.title !== undefined &&
          !slugTouched.current &&
          !flags.isPublished
        ) {
          next.slug = slugify(patch.title);
        }
        return next;
      });
      scheduleSave();
    },
    [flags.isPublished, scheduleSave],
  );

  const [warnings, setWarnings] = useState<string[] | null>(null);

  /** Friendly pre-publish nudges — never blocking, the server enforces the
      hard requirements (title, slug, author…). */
  function qualityWarnings(): string[] {
    const m = metaRef.current;
    const found: string[] = [];
    if (!m.cover?.asset) {
      found.push(
        "No cover thumbnail — the listing and link previews will show a textured placeholder.",
      );
    }
    let missingAlt = 0;
    const checkAlt = (img?: { asset?: unknown; alt?: string } | null) => {
      if (img?.asset && !img.alt?.trim()) missingAlt += 1;
    };
    checkAlt(m.cover);
    for (const block of bodyRef.current) {
      const b = block as unknown as {
        _type?: string;
        image?: { asset?: unknown; alt?: string };
        left?: { asset?: unknown; alt?: string };
        right?: { asset?: unknown; alt?: string };
      };
      if (b._type === "essayImage") checkAlt(b.image);
      if (b._type === "imagePair") {
        checkAlt(b.left);
        checkAlt(b.right);
      }
    }
    if (missingAlt > 0) {
      found.push(
        `${missingAlt} photo${missingAlt > 1 ? "s are" : " is"} missing alt text — screen readers and search engines can't see ${missingAlt > 1 ? "them" : "it"}.`,
      );
    }
    if (!m.excerpt.trim()) {
      found.push("No listing excerpt — the dek will be reused on the listing page.");
    }
    if (m.tags.length === 0) {
      found.push("No tags — the pill row at the end of the essay will be empty.");
    }
    return found;
  }

  async function publish(force = false) {
    setWarnings(null);
    await doSave();
    if (!force) {
      const found = qualityWarnings();
      if (found.length) {
        setWarnings(found);
        return;
      }
    }
    try {
      await api(`/api/editor/essays/${encodeURIComponent(id)}/publish`, {
        method: "POST",
      });
      setFlags({ isPublished: true, hasDraft: false });
      setNotice(null);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Publishing failed.");
    }
  }

  async function addAuthor() {
    const name = window.prompt("New author's name:");
    if (!name?.trim()) return;
    try {
      const { author } = await api<{ author: Author }>("/api/editor/authors", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setAuthors([...authors, author].sort((a, b) => a.name.localeCompare(b.name)));
      updateMeta({ authorId: author._id });
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not add the author.");
    }
  }

  const renderBlock: RenderBlockFunction = useCallback((props) => {
    switch (props.schemaType.name) {
      case "essayImage":
        return <EditorImageBlock props={props} />;
      case "imagePair":
        return <EditorImagePairBlock props={props} />;
      case "youtube":
        return <EditorYoutubeBlock props={props} />;
      case "socialEmbed":
        return <EditorSocialEmbedBlock props={props} />;
      default:
        return <TextBlock props={props} />;
    }
  }, []);

  const renderDecorator: RenderDecoratorFunction = useCallback((props) => {
    if (props.value === "strong") return <strong>{props.children}</strong>;
    if (props.value === "em") return <em>{props.children}</em>;
    return <>{props.children}</>;
  }, []);

  const renderAnnotation: RenderAnnotationFunction = useCallback((props) => {
    if (props.schemaType.name === "link") {
      return <span className={ESSAY_STYLES.link}>{props.children}</span>;
    }
    return <>{props.children}</>;
  }, []);

  const renderPlaceholder: RenderPlaceholderFunction = useCallback(
    () => (
      <span className="pointer-events-none absolute text-content-soft/35">
        Tell the story…
      </span>
    ),
    [],
  );

  const saveLabel = {
    saved: "Saved",
    dirty: "Unsaved changes",
    saving: "Saving…",
    error: "Couldn't save",
  }[saveState];

  return (
    <>
      {/* Editor top bar (the public navbar is hidden on /write). */}
      <div className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-4 px-5 md:px-8">
          <Link
            href="/write"
            className="text-sm font-semibold text-saffron transition-colors hover:text-saffron-dark"
          >
            ← Essays
          </Link>
          <span
            className={`font-mono text-xs ${
              saveState === "error" ? "text-red-500" : "text-content-soft/70"
            }`}
          >
            {saveLabel}
          </span>
          <span className="hidden font-mono text-xs text-content-soft/50 sm:inline">
            {stats.minutes} min read · {stats.photos} photographs
          </span>
          <span className="ml-auto" />
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-content-soft transition-colors hover:text-saffron"
            >
              Preview ↗
            </a>
          )}
          {flags.isPublished && meta.slug && (
            <a
              href={`/photo-essays/${meta.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-content-soft transition-colors hover:text-saffron"
            >
              View live ↗
            </a>
          )}
          <button
            type="button"
            onClick={() => setSettingsOpen((o) => !o)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              settingsOpen
                ? "border-saffron text-saffron"
                : "border-hairline text-content hover:border-saffron hover:text-saffron"
            }`}
          >
            Story settings
          </button>
          <button
            type="button"
            onClick={() => publish()}
            disabled={flags.isPublished && !flags.hasDraft && saveState === "saved"}
            className="rounded-full bg-saffron px-5 py-1.5 text-sm font-semibold text-paper transition-colors hover:bg-saffron-dark disabled:opacity-40"
          >
            {flags.isPublished ? "Publish changes" : "Publish"}
          </button>
        </div>
        {notice && (
          <div className="border-t border-saffron/30 bg-saffron/10 px-5 py-2 text-center text-sm text-saffron-dark">
            {notice}
          </div>
        )}
        {warnings && (
          <div className="border-t border-marigold/40 bg-marigold/10 px-5 py-3">
            <div className="mx-auto max-w-2xl">
              <p className="text-sm font-semibold text-content">
                A quick look before this goes live:
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-content-soft">
                {warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setWarnings(null)}
                  className="rounded-full border border-hairline px-4 py-1.5 text-sm font-medium text-content hover:border-saffron hover:text-saffron"
                >
                  Keep editing
                </button>
                <button
                  type="button"
                  onClick={() => publish(true)}
                  className="rounded-full bg-saffron px-4 py-1.5 text-sm font-semibold text-paper hover:bg-saffron-dark"
                >
                  Publish anyway
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <article className="pb-32">
        {/* Header — same bones as the public essay page. */}
        <header className="mx-auto max-w-[760px] px-5 pt-10 md:px-8 md:pt-16">
          <div className="flex flex-wrap items-center gap-3.5 text-sm">
            <span className="font-semibold text-saffron/60">← All essays</span>
            <span aria-hidden className="text-content-soft/40">
              /
            </span>
            <input
              value={meta.location}
              onChange={(e) => updateMeta({ location: e.target.value })}
              placeholder="LOCATION, STATE"
              className={`min-w-0 flex-1 bg-transparent uppercase outline-none placeholder:text-saffron/40 ${ESSAY_STYLES.kicker}`}
            />
          </div>

          <AutoTextarea
            value={meta.title}
            onChange={(v) => updateMeta({ title: v })}
            placeholder="Title of the story"
            className={`mt-6 w-full resize-none bg-transparent outline-none placeholder:text-content/25 ${ESSAY_STYLES.title}`}
          />
          <AutoTextarea
            value={meta.dek}
            onChange={(v) => updateMeta({ dek: v })}
            placeholder="A one-or-two sentence dek — the italic line readers see under the title."
            className={`mt-6 w-full resize-none bg-transparent outline-none placeholder:text-content-soft/35 ${ESSAY_STYLES.dek}`}
          />

          {/* Compact byline — mirrors the public page: date + share slot on
              the left, writer on the right. */}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-hairline py-3">
            <input
              type="date"
              value={meta.publishedAt}
              onChange={(e) => updateMeta({ publishedAt: e.target.value })}
              className="bg-transparent text-[13.5px] text-content-soft outline-none"
            />
            <span className="text-[13.5px] text-content-soft/60">
              · {stats.minutes} min read · {stats.photos} photographs
            </span>
            <select
              value={meta.authorId ?? ""}
              onChange={(e) =>
                e.target.value === "__new__"
                  ? addAuthor()
                  : updateMeta({ authorId: e.target.value || null })
              }
              className="ml-auto max-w-56 bg-transparent text-right text-[13.5px] font-semibold text-content outline-none"
            >
              <option value="">Choose author…</option>
              {authors.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
              <option value="__new__">＋ New author…</option>
            </select>
          </div>
        </header>

        {/* Body — the cover lives in Story settings; it's a thumbnail only. */}
        <div className="editor-body relative mt-12 md:mt-14">
          <PortableTextEditable
            className="outline-none"
            renderBlock={renderBlock}
            renderDecorator={renderDecorator}
            renderAnnotation={renderAnnotation}
            renderPlaceholder={renderPlaceholder}
            onPaste={handlePaste}
            hotkeys={{ marks: { "mod+b": "strong", "mod+i": "em" } }}
            spellCheck
          />
          <EditorToolbar />
        </div>
      </article>

      {settingsOpen && (
        <SettingsPanel
          id={id}
          meta={meta}
          flags={flags}
          previewUrl={previewUrl}
          updateMeta={(patch) => {
            if (patch.slug !== undefined) slugTouched.current = true;
            updateMeta(patch);
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </>
  );
}

/** A normal paragraph or pull quote inside the editable. */
function TextBlock({ props }: { props: BlockRenderProps }) {
  const value = props.value as PortableTextBlock & {
    children?: { text?: string }[];
  };
  const isEmpty =
    value.children?.length === 1 && (value.children[0].text ?? "") === "";

  if (props.style === "pullQuote") {
    return (
      <div className={`relative ${ESSAY_STYLES.pullQuoteWrap}`}>
        <div
          className={`${ESSAY_STYLES.pullQuoteText} before:content-['“'] after:content-['”']`}
        >
          {props.children}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${ESSAY_STYLES.paragraph}`}>
      {props.focused && isEmpty && <PlusMenu />}
      {props.children}
    </div>
  );
}

function AutoTextarea({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  );
}

function SettingsPanel({
  id,
  meta,
  flags,
  previewUrl,
  updateMeta,
  onClose,
}: {
  id: string;
  meta: EditorEssayDoc;
  flags: { hasDraft: boolean; isPublished: boolean };
  previewUrl: string | null;
  updateMeta: (patch: Partial<EditorEssayDoc>) => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const label = "block font-mono text-[11px] uppercase tracking-wider text-content-soft/70";
  const field =
    "mt-1.5 w-full rounded-lg border border-hairline bg-transparent px-3 py-2 text-sm text-content outline-none focus:border-saffron";

  async function discardDraft() {
    if (!window.confirm("Discard the unpublished changes and go back to the published version?")) return;
    await api(`/api/editor/essays/${encodeURIComponent(id)}?scope=draft`, {
      method: "DELETE",
    });
    window.location.reload();
  }

  async function deleteEssay() {
    if (!window.confirm("Delete this essay entirely? This cannot be undone.")) return;
    await api(`/api/editor/essays/${encodeURIComponent(id)}`, { method: "DELETE" });
    window.location.href = "/write";
  }

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto border-l border-hairline bg-card p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <h2 className="font-essay text-xl font-semibold text-content">Story settings</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-content-soft hover:border-saffron hover:text-saffron"
        >
          ✕
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className={label}>
            Cover — thumbnail for listings & link previews (not shown in the article)
          </label>
          <div className="mt-2">
            <ImageSlot
              value={meta.cover ?? undefined}
              onChange={(cover) => updateMeta({ cover })}
              frameClass="aspect-[16/10] rounded-lg"
              sizeHint="thumbnail"
            />
          </div>
        </div>
        <div>
          <label className={label}>
            URL slug {flags.isPublished && "(careful — the essay is live)"}
          </label>
          <input
            className={field}
            value={meta.slug}
            onChange={(e) => updateMeta({ slug: slugify(e.target.value) })}
          />
          <p className="mt-1 text-xs text-content-soft/60">/photo-essays/{meta.slug || "…"}</p>
        </div>
        <div>
          <label className={label}>Listing excerpt (falls back to the dek)</label>
          <textarea
            className={`${field} resize-none`}
            rows={3}
            value={meta.excerpt}
            onChange={(e) => updateMeta({ excerpt: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>Tags (comma separated)</label>
          <input
            className={field}
            value={meta.tags.join(", ")}
            onChange={(e) =>
              updateMeta({
                tags: e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Meghalaya, Living infrastructure"
          />
        </div>
        <div>
          <label className={label}>Companion video URL</label>
          <input
            className={field}
            value={meta.videoUrl}
            onChange={(e) => updateMeta({ videoUrl: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=…"
          />
        </div>
        <div>
          <label className={label}>Read time override (minutes)</label>
          <input
            className={field}
            type="number"
            min={1}
            value={meta.readMinutes ?? ""}
            onChange={(e) =>
              updateMeta({
                readMinutes: e.target.value ? Number(e.target.value) : null,
              })
            }
            placeholder="auto"
          />
        </div>

        {previewUrl && (
          <div className="border-t border-hairline pt-5">
            <label className={label}>Share the draft with a reviewer</label>
            <p className="mt-1 text-xs leading-relaxed text-content-soft/70">
              Anyone with this private link sees the current working version —
              no password needed. It updates as you keep writing.
            </p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(previewUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  window.prompt("Copy the preview link:", previewUrl);
                }
              }}
              className="mt-2 w-full rounded-full border border-saffron/40 px-4 py-2 text-sm font-semibold text-saffron transition-colors hover:bg-saffron/10"
            >
              {copied ? "Link copied ✓" : "Copy reviewer link"}
            </button>
          </div>
        )}

        <div className="border-t border-hairline pt-5">
          {flags.isPublished && flags.hasDraft && (
            <button
              type="button"
              onClick={discardDraft}
              className="block text-sm font-medium text-content-soft hover:text-saffron"
            >
              Discard unpublished changes
            </button>
          )}
          <button
            type="button"
            onClick={deleteEssay}
            className="mt-3 block text-sm font-medium text-red-500 hover:text-red-600"
          >
            Delete essay
          </button>
        </div>
      </div>
    </aside>
  );
}
