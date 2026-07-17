"use client";

import { useRef, useState } from "react";
import { useEditor, type BlockRenderProps } from "@portabletext/editor";
import { ESSAY_STYLES } from "@/lib/essayStyles";
import { detectEmbed, SocialEmbed } from "@/components/SocialEmbed";
import {
  editorImageUrl,
  uploadImage,
  youtubeId,
  type EditorImageValue,
} from "./editorUtils";

// The visual blocks a writer can drop into an essay, rendered inside the
// editor exactly as they render on the site — plus upload/caption controls.

/** Chrome around every void block: hover ring + delete, keeps Slate happy. */
function BlockShell({
  props,
  children,
}: {
  props: BlockRenderProps;
  children: React.ReactNode;
}) {
  const editor = useEditor();
  return (
    <div
      contentEditable={false}
      className={`group/block relative my-10 rounded-sm ${
        props.selected ? "ring-2 ring-saffron/40" : ""
      }`}
    >
      {children}
      <button
        type="button"
        title="Remove block"
        onClick={() => {
          editor.send({ type: "delete.block", at: props.path });
          editor.send({ type: "focus" });
        }}
        className="absolute -top-3 right-3 hidden h-7 w-7 items-center justify-center rounded-full border border-hairline bg-canvas text-sm text-content-soft shadow-sm transition-colors hover:border-red-400 hover:text-red-500 group-hover/block:flex"
      >
        ✕
      </button>
      {/* Slate requires the void block's children in the DOM. */}
      <span className="hidden">{props.children}</span>
    </div>
  );
}

/** One photo slot: textured drop-target until an image is uploaded. */
export function ImageSlot({
  value,
  onChange,
  frameClass,
  sizeHint,
  captionCenter = false,
}: {
  value: EditorImageValue | undefined;
  onChange: (next: EditorImageValue) => void;
  frameClass: string;
  sizeHint: string;
  captionCenter?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const url = editorImageUrl(value);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { assetId } = await uploadImage(file);
      onChange({
        ...(value ?? { _type: "image" }),
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <figure className="flex min-w-0 flex-col gap-2.5">
      <div
        className={`relative overflow-hidden ${frameClass} ${url ? "" : "essay-placeholder"}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={value?.alt ?? ""}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            url ? "bg-ink/40 opacity-0 hover:opacity-100" : ""
          }`}
        >
          <span
            className={`rounded-full px-4 py-2 font-mono text-xs ${
              url
                ? "bg-canvas text-content"
                : "border border-hairline bg-canvas text-content-soft"
            }`}
          >
            {busy ? "Uploading…" : url ? "Replace photo" : `＋ Add photo · ${sizeHint}`}
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <input
        value={value?.caption ?? ""}
        onChange={(e) => onChange({ ...(value ?? { _type: "image" }), caption: e.target.value })}
        placeholder="Write a caption (optional)…"
        className={`w-full bg-transparent outline-none placeholder:text-content-soft/40 ${ESSAY_STYLES.caption} ${
          captionCenter ? "text-center" : ""
        }`}
      />
      <input
        value={value?.alt ?? ""}
        onChange={(e) => onChange({ ...(value ?? { _type: "image" }), alt: e.target.value })}
        placeholder="Describe the photo for screen readers (alt text)…"
        className={`w-full bg-transparent font-sans text-xs text-content-soft/70 outline-none placeholder:text-content-soft/35 ${
          captionCenter ? "text-center" : ""
        }`}
      />
    </figure>
  );
}

export function EditorImageBlock({ props }: { props: BlockRenderProps }) {
  const editor = useEditor();
  const value = props.value as unknown as {
    image?: EditorImageValue;
    fullBleed?: boolean;
  };

  const set = (patch: Record<string, unknown>) =>
    editor.send({ type: "block.set", at: props.path, props: patch });

  const frame = value.fullBleed
    ? "h-[360px] w-full md:h-[560px]"
    : "aspect-[3/2] rounded-lg";

  return (
    <BlockShell props={props}>
      <div
        className={
          value.fullBleed ? "" : "mx-auto max-w-[1000px] px-5 md:px-8"
        }
      >
        <ImageSlot
          value={value.image}
          onChange={(image) => set({ image })}
          frameClass={frame}
          sizeHint={value.fullBleed ? "full-bleed" : "wide"}
          captionCenter
        />
        <label className="mt-2 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-wider text-content-soft/60">
          <input
            type="checkbox"
            checked={Boolean(value.fullBleed)}
            onChange={(e) => set({ fullBleed: e.target.checked })}
            className="accent-saffron"
          />
          Full-bleed (edge to edge)
        </label>
      </div>
    </BlockShell>
  );
}

export function EditorImagePairBlock({ props }: { props: BlockRenderProps }) {
  const editor = useEditor();
  const value = props.value as unknown as {
    left?: EditorImageValue;
    right?: EditorImageValue;
  };
  const set = (patch: Record<string, unknown>) =>
    editor.send({ type: "block.set", at: props.path, props: patch });

  return (
    <BlockShell props={props}>
      <div className="mx-auto grid max-w-[1000px] gap-5 px-5 md:grid-cols-[1fr_1.4fr] md:px-8">
        <ImageSlot
          value={value.left}
          onChange={(left) => set({ left })}
          frameClass="h-[300px] rounded-lg md:h-[460px]"
          sizeHint="portrait"
        />
        <ImageSlot
          value={value.right}
          onChange={(right) => set({ right })}
          frameClass="h-[300px] rounded-lg md:h-[460px]"
          sizeHint="landscape"
        />
      </div>
    </BlockShell>
  );
}

export function EditorSocialEmbedBlock({ props }: { props: BlockRenderProps }) {
  const editor = useEditor();
  const value = props.value as unknown as { url?: string };
  const url = value.url ?? "";

  return (
    <BlockShell props={props}>
      <div className="mx-auto max-w-[600px] px-5 md:px-8">
        {detectEmbed(url) ? (
          <SocialEmbed url={url} />
        ) : (
          <div className="essay-placeholder flex h-40 items-center justify-center rounded-xl">
            <span className="px-6 text-center font-mono text-xs text-content-soft/70">
              Paste a tweet (twitter.com / x.com) or Instagram post/reel link below
            </span>
          </div>
        )}
        <input
          value={url}
          onChange={(e) =>
            editor.send({
              type: "block.set",
              at: props.path,
              props: { url: e.target.value },
            })
          }
          placeholder="https://x.com/… or https://www.instagram.com/reel/…"
          className="mt-2.5 w-full bg-transparent text-center font-mono text-sm text-content-soft outline-none placeholder:text-content-soft/40"
        />
      </div>
    </BlockShell>
  );
}

export function EditorYoutubeBlock({ props }: { props: BlockRenderProps }) {
  const editor = useEditor();
  const value = props.value as unknown as { url?: string; caption?: string };
  const set = (patch: Record<string, unknown>) =>
    editor.send({ type: "block.set", at: props.path, props: patch });
  const id = youtubeId(value.url ?? "");

  return (
    <BlockShell props={props}>
      <div className="mx-auto max-w-[760px] px-5 md:px-8">
        {id ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-ink">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title="YouTube preview"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="essay-placeholder flex aspect-video w-full items-center justify-center rounded-xl">
            <span className="font-mono text-xs text-content-soft/70">
              Paste a YouTube link below
            </span>
          </div>
        )}
        <input
          value={value.url ?? ""}
          onChange={(e) => set({ url: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=…"
          className="mt-2.5 w-full bg-transparent text-center font-mono text-sm text-content-soft outline-none placeholder:text-content-soft/40"
        />
        <input
          value={value.caption ?? ""}
          onChange={(e) => set({ caption: e.target.value })}
          placeholder="Write a caption (optional)…"
          className={`mt-1 w-full bg-transparent text-center outline-none placeholder:text-content-soft/40 ${ESSAY_STYLES.caption}`}
        />
      </div>
    </BlockShell>
  );
}
