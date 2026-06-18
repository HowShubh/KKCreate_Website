"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type ConnectionLike = {
  saveData?: boolean;
  effectiveType?: string;
};

export function HeroVideo({
  poster,
  srcMp4,
  alt,
  className = "relative aspect-[4/5] rounded-3xl bg-canvas-2 shadow-lg",
  grayscale = false,
  objectPosition = "center",
  overlays,
  children,
}: {
  poster: string;
  srcMp4: string;
  alt: string;
  /** Container classes — controls sizing/position/shape. */
  className?: string;
  /** Desaturate the media (useful behind overlaid text). */
  grayscale?: boolean;
  /** CSS object-position for the media's focal point (e.g. "right top", "70% 20%"). */
  objectPosition?: string;
  /** Tint / gradient layers rendered above the media. Falls back to a soft feather. */
  overlays?: React.ReactNode;
  /** Content overlaid above everything (e.g. hero copy). */
  children?: React.ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Whether we've decided to load the video at all (false on slow/save-data).
  const [loadVideo, setLoadVideo] = useState(false);
  // Whether the video is actually playing — drives the crossfade.
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const conn = (
      navigator as Navigator & { connection?: ConnectionLike }
    ).connection;
    const slow =
      !!conn &&
      (conn.saveData === true || /(^|[^4])2g/.test(conn.effectiveType ?? ""));

    if (reduceMotion || slow) return; // keep the poster, never fetch the video

    // Defer until the browser is idle so the video never competes with
    // first paint — the poster is what the user sees on load.
    const start = () => setLoadVideo(true);
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(start, { timeout: 2500 });
    } else {
      const t = setTimeout(start, 1000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (loadVideo && videoRef.current) {
      videoRef.current.play().catch(() => {
        /* autoplay can be blocked; poster stays */
      });
    }
  }, [loadVideo]);

  const mediaTone = grayscale ? "grayscale" : "";

  return (
    <div className={`overflow-hidden ${className}`}>
      {/* Poster — shown instantly on load, fades out once the video plays */}
      <Image
        src={poster}
        alt={alt}
        fill
        priority
        sizes="100vw"
        style={{ objectPosition }}
        className={`object-cover transition-opacity duration-1000 ease-out ${mediaTone} ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      />

      {loadVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={poster}
          onPlaying={() => setPlaying(true)}
          style={{ objectPosition }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${mediaTone} ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={srcMp4} type="video/mp4" />
        </video>
      )}

      {/* Tint / feather layers (custom for full-bleed, soft default otherwise) */}
      {overlays ?? (
        <>
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_18px_rgba(20,17,15,0.55)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-ink/10" />
        </>
      )}

      {children}
    </div>
  );
}
