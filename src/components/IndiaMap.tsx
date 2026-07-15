"use client";

import { useState } from "react";
import Image from "next/image";
import type { FilmedPlace } from "@/lib/content";
import { INDIA_DOTS, INDIA_MAP_W, INDIA_MAP_H } from "@/lib/india-dots";

// Dotted India map with clickable pins. Clicking a pin opens a small card with
// the video filmed at that place. The dot matrix is pre-generated from the
// official India boundary GeoJSON (see src/lib/india-dots.ts); pin x/y in
// FILMED_PLACES live in the same projected coordinate space.

export function IndiaMap({ places }: { places: FilmedPlace[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = places.find((p) => p.id === activeId) ?? null;

  return (
    <div className="relative mx-auto w-full max-w-xl select-none">
      {/* Dot matrix */}
      <svg
        viewBox={`0 0 ${INDIA_MAP_W} ${INDIA_MAP_H}`}
        className="block w-full text-content/45"
        aria-label="Map of India showing places we've filmed"
        role="img"
        onClick={() => setActiveId(null)}
      >
        {INDIA_DOTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={0.55} fill="currentColor" />
        ))}
      </svg>

      {/* Pins */}
      {places.map((p) => {
        const isActive = p.id === activeId;
        return (
          <button
            key={p.id}
            type="button"
            aria-label={`${p.city}: ${p.title}`}
            aria-expanded={isActive}
            onClick={() => setActiveId(isActive ? null : p.id)}
            className={`absolute z-10 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-transform hover:scale-125 ${
              isActive ? "bg-saffron" : "bg-content"
            }`}
            style={{
              left: `${(p.x / INDIA_MAP_W) * 100}%`,
              top: `${(p.y / INDIA_MAP_H) * 100}%`,
            }}
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-canvas" />
          </button>
        );
      })}

      {/* Popup card */}
      {active && (
        <div
          className="absolute z-20 w-56 overflow-hidden rounded-xl border border-hairline bg-card shadow-2xl sm:w-64"
          style={{
            left: `${(active.x / INDIA_MAP_W) * 100}%`,
            top: `${(active.y / INDIA_MAP_H) * 100}%`,
            transform: `translate(${active.x > INDIA_MAP_W * 0.55 ? "calc(-100% - 14px)" : "14px"}, ${
              active.y > INDIA_MAP_H * 0.55 ? "calc(-100% - 14px)" : "14px"
            })`,
          }}
        >
          {active.thumbnail && (
            <div className="relative aspect-video bg-canvas-2">
              <Image
                src={active.thumbnail}
                alt={active.title}
                fill
                sizes="256px"
                className="object-cover grayscale"
              />
            </div>
          )}
          <div className="p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-saffron">
              {active.city}
            </p>
            <p className="mt-1 text-sm font-semibold leading-snug text-content">
              {active.title}
            </p>
            <p className="mt-1 text-xs text-content-soft">{active.views}</p>
            <a
              href={active.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-saffron transition-colors hover:text-saffron-dark"
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch on YouTube <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
