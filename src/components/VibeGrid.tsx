"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type VibePhoto = {
  srcs: readonly string[];
  caption: string;
  span: string;
};

export function VibeGrid({ photos }: { photos: readonly VibePhoto[] }) {
  // Per-frame image index. Seeded so frames start on different images.
  const [active, setActive] = useState<number[]>(() =>
    photos.map((p, i) => i % p.srcs.length),
  );

  useEffect(() => {
    // Advance exactly one frame every 6s, cycling through frames in turn, so
    // changes feel subtle and staggered rather than all-at-once.
    let cursor = 0;
    const id = setInterval(() => {
      setActive((prev) => {
        const next = [...prev];
        next[cursor] = (next[cursor] + 1) % photos[cursor].srcs.length;
        cursor = (cursor + 1) % photos.length;
        return next;
      });
    }, 6000);
    return () => clearInterval(id);
  }, [photos]);

  const isOdd = photos.length % 2 === 1;

  return (
    <div className="grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[200px] md:grid-cols-4">
      {photos.map((photo, i) => {

        // Spans apply only from md+ so the mobile grid stays a clean 2-col
        // tile. The last item fills the trailing mobile row when the count is
        // odd, which removes the gap left by the tall/wide frames.
        const span = [
          photo.span === "tall" && "md:row-span-2",
          photo.span === "wide" && "md:col-span-2",
          i === photos.length - 1 && isOdd && "col-span-2",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-2xl bg-canvas-2 ${span}`}
          >
            {photo.srcs.map((src, s) => (
              <Image
                key={src}
                src={src}
                alt={photo.caption}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className={`object-cover transition-opacity duration-[1500ms] ease-in-out ${
                  s === active[i] ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="text-sm font-medium text-paper">{photo.caption}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
