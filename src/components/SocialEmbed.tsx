"use client";

import { useEffect, useRef } from "react";

// Renders a tweet or Instagram post/reel from its URL using the platforms'
// official embed scripts (loaded once, on demand). Unrecognised URLs fall
// back to a plain link card. Used by the essay page and the /write editor.

export type EmbedKind = "twitter" | "instagram";

export function detectEmbed(url: string): EmbedKind | null {
  if (/(?:twitter\.com|x\.com)\/[^/]+\/status\/\d+/.test(url)) return "twitter";
  if (/instagram\.com\/(?:p|reel|tv)\/[\w-]+/.test(url)) return "instagram";
  return null;
}

const scriptPromises = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  const existing = scriptPromises.get(src);
  if (existing) return existing;
  const promise = new Promise<void>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => {
      scriptPromises.delete(src);
      reject(new Error(`Failed to load ${src}`));
    };
    document.body.appendChild(el);
  });
  scriptPromises.set(src, promise);
  return promise;
}

type TwitterGlobal = { widgets?: { load: (el?: HTMLElement | null) => void } };
type InstagramGlobal = { Embeds?: { process: () => void } };

export function SocialEmbed({ url }: { url: string }) {
  const kind = detectEmbed(url);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (kind === "twitter") {
      loadScript("https://platform.twitter.com/widgets.js")
        .then(() =>
          (window as { twttr?: TwitterGlobal }).twttr?.widgets?.load(ref.current),
        )
        .catch(() => {});
    }
    if (kind === "instagram") {
      loadScript("https://www.instagram.com/embed.js")
        .then(() =>
          (window as { instgrm?: InstagramGlobal }).instgrm?.Embeds?.process(),
        )
        .catch(() => {});
    }
  }, [kind, url]);

  if (kind === "twitter") {
    // widgets.js knows twitter.com; normalise x.com links for it.
    const tweetUrl = url.replace(/https?:\/\/(www\.)?x\.com/, "https://twitter.com");
    return (
      <div ref={ref} className="flex justify-center [&_iframe]:!max-w-full">
        <blockquote className="twitter-tweet" data-dnt="true">
          <a href={tweetUrl}>{tweetUrl}</a>
        </blockquote>
      </div>
    );
  }

  if (kind === "instagram") {
    return (
      <div ref={ref} className="flex justify-center [&_iframe]:!max-w-full">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ maxWidth: 540, minWidth: 280, width: "100%" }}
        >
          <a href={url}>{url}</a>
        </blockquote>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block truncate rounded-xl border border-hairline bg-card px-5 py-4 text-sm text-saffron underline underline-offset-4"
    >
      {url}
    </a>
  );
}
