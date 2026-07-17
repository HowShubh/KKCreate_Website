"use client";

import { useEffect, useState } from "react";
import { useEditor, useEditorSelector } from "@portabletext/editor";
import * as selectors from "@portabletext/editor/selectors";

// Medium-style floating bubble over any text selection: Bold, Italic, Link,
// and Pull-quote. Buttons use onMouseDown+preventDefault so the text
// selection in the editable never collapses.

export function EditorToolbar() {
  const editor = useEditor();
  const expanded = useEditorSelector(editor, selectors.isSelectionExpanded);
  const strong = useEditorSelector(editor, selectors.isActiveDecorator("strong"));
  const em = useEditorSelector(editor, selectors.isActiveDecorator("em"));
  const link = useEditorSelector(editor, selectors.isActiveAnnotation("link"));
  const quote = useEditorSelector(editor, selectors.isActiveStyle("pullQuote"));
  const focusTextBlock = useEditorSelector(editor, selectors.getFocusTextBlock);

  const [rect, setRect] = useState<{ top: number; left: number } | null>(null);
  const [linkDraft, setLinkDraft] = useState<string | null>(null);

  const visible = expanded && Boolean(focusTextBlock);

  useEffect(() => {
    if (!visible) {
      setRect(null);
      setLinkDraft(null);
      return;
    }
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const r = sel.getRangeAt(0).getBoundingClientRect();
    setRect({
      top: r.top - 12,
      left: Math.max(80, r.left + r.width / 2),
    });
  }, [visible, strong, em, link, quote, focusTextBlock]);

  if (!visible || !rect) return null;

  const btn = (active: boolean) =>
    `flex h-9 min-w-9 items-center justify-center px-2.5 text-sm transition-colors ${
      active ? "text-saffron" : "text-paper hover:text-marigold"
    }`;

  function act(fn: () => void) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      fn();
      editor.send({ type: "focus" });
    };
  }

  return (
    <div
      className="fixed z-50 -translate-x-1/2 -translate-y-full"
      style={{ top: rect.top, left: rect.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex items-center overflow-hidden rounded-lg bg-ink shadow-xl">
        {linkDraft === null ? (
          <>
            <button
              type="button"
              className={`${btn(strong)} font-bold`}
              onMouseDown={act(() =>
                editor.send({ type: "decorator.toggle", decorator: "strong" }),
              )}
            >
              B
            </button>
            <button
              type="button"
              className={`${btn(em)} font-essay italic`}
              onMouseDown={act(() =>
                editor.send({ type: "decorator.toggle", decorator: "em" }),
              )}
            >
              i
            </button>
            <button
              type="button"
              className={btn(Boolean(link))}
              onMouseDown={(e) => {
                e.preventDefault();
                if (link) {
                  editor.send({ type: "annotation.remove", annotation: { name: "link" } });
                  editor.send({ type: "focus" });
                } else {
                  setLinkDraft("");
                }
              }}
            >
              🔗
            </button>
            <span className="h-5 w-px bg-paper/20" aria-hidden />
            <button
              type="button"
              className={`${btn(quote)} font-essay text-lg`}
              title="Pull quote"
              onMouseDown={act(() =>
                editor.send({ type: "style.toggle", style: "pullQuote" }),
              )}
            >
              &ldquo;
            </button>
          </>
        ) : (
          <form
            className="flex items-center gap-1 px-2"
            onSubmit={(e) => {
              e.preventDefault();
              const href = linkDraft.trim();
              if (href) {
                editor.send({
                  type: "annotation.add",
                  annotation: {
                    name: "link",
                    value: { href: /^https?:\/\//.test(href) ? href : `https://${href}` },
                  },
                });
              }
              setLinkDraft(null);
              editor.send({ type: "focus" });
            }}
          >
            <input
              autoFocus
              value={linkDraft}
              onChange={(e) => setLinkDraft(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Paste or type a link…"
              className="h-9 w-56 bg-transparent text-sm text-paper outline-none placeholder:text-paper/40"
            />
            <button type="submit" className="text-sm font-semibold text-marigold">
              Add
            </button>
          </form>
        )}
      </div>
      <div className="mx-auto h-2 w-2 -translate-y-1 rotate-45 bg-ink" aria-hidden />
    </div>
  );
}
