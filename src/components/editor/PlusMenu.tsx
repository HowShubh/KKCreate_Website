"use client";

import { useState } from "react";
import { useEditor } from "@portabletext/editor";

// Medium's "+" in the left margin of an empty paragraph: opens a small menu
// of visual blocks to insert at that spot.

const ITEMS: {
  label: string;
  hint: string;
  icon: string;
  insert: { name: string; value?: Record<string, unknown> } | "pullQuote";
}[] = [
  {
    label: "Photo",
    hint: "wide or full-bleed",
    icon: "🖼",
    insert: { name: "essayImage", value: { fullBleed: false } },
  },
  {
    label: "Photo pair",
    hint: "portrait + landscape",
    icon: "⿻",
    insert: { name: "imagePair", value: {} },
  },
  { label: "Pull quote", hint: "big italic line", icon: "❝", insert: "pullQuote" },
  {
    label: "YouTube",
    hint: "embed a video",
    icon: "▶",
    insert: { name: "youtube", value: {} },
  },
  {
    label: "Tweet / Instagram",
    hint: "embed a post or reel",
    icon: "@",
    insert: { name: "socialEmbed", value: {} },
  },
];

export function PlusMenu() {
  const editor = useEditor();
  const [open, setOpen] = useState(false);

  return (
    <div
      contentEditable={false}
      className="absolute -left-2 top-1/2 -translate-y-1/2 select-none md:-left-12"
    >
      <button
        type="button"
        title="Add a photo, quote or video"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        className={`flex h-8 w-8 items-center justify-center rounded-full border text-lg leading-none transition-all ${
          open
            ? "rotate-45 border-saffron text-saffron"
            : "border-hairline text-content-soft/60 hover:border-saffron hover:text-saffron"
        }`}
      >
        +
      </button>
      {open && (
        <div className="absolute left-10 top-1/2 z-40 w-56 -translate-y-1/2 overflow-hidden rounded-xl border border-hairline bg-card shadow-xl">
          {ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-canvas-2"
              onMouseDown={(e) => {
                e.preventDefault();
                setOpen(false);
                if (item.insert === "pullQuote") {
                  editor.send({ type: "style.toggle", style: "pullQuote" });
                } else {
                  editor.send({
                    type: "insert.block object",
                    blockObject: item.insert,
                    placement: "auto",
                  });
                }
                editor.send({ type: "focus" });
              }}
            >
              <span className="w-6 text-center text-base" aria-hidden>
                {item.icon}
              </span>
              <span>
                <span className="block text-sm font-semibold text-content">
                  {item.label}
                </span>
                <span className="block text-xs text-content-soft/70">{item.hint}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
