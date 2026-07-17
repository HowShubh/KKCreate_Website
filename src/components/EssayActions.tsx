"use client";

import { useState } from "react";

// Share button in the essay byline: native share sheet where available,
// otherwise copies the link (with a legacy execCommand fallback).
export function EssayActions({ title }: { slug?: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fall through to copy when the user dismisses the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API unavailable/denied — legacy path.
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } finally {
        ta.remove();
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={share}
      className="rounded-full border border-hairline px-4 py-1.5 text-[13px] font-medium text-content transition-colors hover:border-saffron hover:text-saffron"
    >
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
