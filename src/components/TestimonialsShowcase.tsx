"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FEATURED_TESTIMONIAL,
  TEXT_TESTIMONIALS,
  VIDEO_TESTIMONIALS,
  type VideoTestimonial,
} from "@/lib/content";

export function TestimonialsShowcase() {
  const textQuote = TEXT_TESTIMONIALS[0];

  return (
    <div>
      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-saffron">
          In their words
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-content text-balance md:text-5xl">
          Real People. Real Stories.{" "}
          <span className="text-saffron">Real Change.</span>
        </h2>
      </div>

      {/* Featured testimonial */}
      <div className="mt-12 overflow-hidden rounded-3xl bg-saffron text-paper">
        <div className="grid items-stretch gap-0 md:grid-cols-[1.5fr_1fr]">
          <div className="order-2 p-8 md:order-1 md:p-10">
            <h3 className="font-display text-2xl font-bold md:text-3xl">
              {FEATURED_TESTIMONIAL.stat}
            </h3>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/90">
              {FEATURED_TESTIMONIAL.quote}
            </p>
            <p className="mt-6 font-semibold">{FEATURED_TESTIMONIAL.name}</p>
            <p className="text-sm text-paper/70">{FEATURED_TESTIMONIAL.role}</p>
          </div>
          <div className="relative order-1 min-h-[240px] w-full md:order-2 md:min-h-[340px]">
            <Image
              src={FEATURED_TESTIMONIAL.image}
              alt={FEATURED_TESTIMONIAL.name}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-top"
            />
            {/* Feather the image into the card colour on its inner edge */}
            <div className="absolute inset-0 bg-gradient-to-t from-saffron via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-saffron" />
          </div>
        </div>
      </div>

      {/* Videos + dark quote card */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="grid grid-cols-3 gap-4 sm:gap-5">
          {VIDEO_TESTIMONIALS.map((v) => (
            <VideoCard key={v.id} v={v} />
          ))}
        </div>

        <div className="relative flex flex-col overflow-hidden rounded-3xl bg-ink p-8 text-paper md:p-10">
          <p className="font-display text-xl font-bold leading-snug md:text-2xl">
            {textQuote.quote}
          </p>
          <div className="mt-auto pt-8">
            <p className="font-semibold">{textQuote.name}</p>
            <p className="text-sm text-paper/60">{textQuote.role}</p>
          </div>
          <QuoteMark />
        </div>
      </div>
    </div>
  );
}

function VideoCard({ v }: { v: VideoTestimonial }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Play ${v.name} testimonial`}
        className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-ink"
      >
        <Image
          src={v.thumbnail}
          alt={v.name}
          fill
          sizes="(max-width: 768px) 30vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <span className="absolute bottom-2.5 left-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-marigold text-ink shadow-md transition-transform group-hover:scale-110 md:h-9 md:w-9">
          <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-px fill-current" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="absolute bottom-2.5 right-2.5 hidden text-[11px] font-medium text-paper/90 sm:block">
          {v.name}
        </span>
      </button>

      {open && <VideoModal v={v} onClose={() => setOpen(false)} />}
    </>
  );
}

function VideoModal({
  v,
  onClose,
}: {
  v: VideoTestimonial;
  onClose: () => void;
}) {
  // Close on Escape and lock background scroll while the popup is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${v.name} testimonial video`}
      onClick={onClose}
    >
      {/* Close button — fixed to the screen's top-right corner */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="fixed right-4 top-4 z-[101] flex h-11 w-11 items-center justify-center rounded-full bg-paper/15 text-paper backdrop-blur transition-colors hover:bg-saffron"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Player — clicking the video itself must not close the popup */}
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-ink shadow-2xl">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?autoplay=1`}
            title={`${v.name} testimonial`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

function QuoteMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute bottom-6 right-6 h-14 w-14 fill-paper/15"
      aria-hidden
    >
      <path d="M7 7h5v5c0 2.8-2 5-5 5v-2c1.7 0 3-1.3 3-3H7V7zm8 0h5v5c0 2.8-2 5-5 5v-2c1.7 0 3-1.3 3-3h-3V7z" />
    </svg>
  );
}
