"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { FilmedPlace } from "@/lib/content";
import { INDIA_DOTS, INDIA_MAP_W, INDIA_MAP_H } from "@/lib/india-dots";

// Dotted India map with pins. Hovering a pin previews its video card; clicking
// pins the card open so the "Watch on YouTube" link is clickable. The dot
// matrix is pre-generated from the official India boundary GeoJSON (see
// src/lib/india-dots.ts); pin x/y live in the same projected space.

export function IndiaMap({ places }: { places: FilmedPlace[] }) {
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  // Delay clearing the hover so the cursor can travel the small gap between
  // the pin and its card without the card vanishing mid-way.
  const hoverTimeout = useRef<number | null>(null);

  const keepHover = (id: string) => {
    if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current);
    setHoverId(id);
  };
  const dropHover = () => {
    if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current);
    hoverTimeout.current = window.setTimeout(() => setHoverId(null), 160);
  };
  useEffect(
    () => () => {
      if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current);
    },
    [],
  );

  const activeId = pinnedId ?? hoverId;
  const active = places.find((p) => p.id === activeId) ?? null;

  return (
    <div className="relative mx-auto w-full max-w-xl select-none">
      {/* Dot matrix */}
      <svg
        viewBox={`0 0 ${INDIA_MAP_W} ${INDIA_MAP_H}`}
        className="block w-full text-content/45"
        aria-label="Map of India showing places we've filmed"
        role="img"
        onClick={() => {
          setPinnedId(null);
          setHoverId(null);
        }}
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
            onMouseEnter={() => keepHover(p.id)}
            onMouseLeave={dropHover}
            onFocus={() => keepHover(p.id)}
            onBlur={dropHover}
            onClick={() => {
              const unpinning = pinnedId === p.id;
              setPinnedId(unpinning ? null : p.id);
              // On touch there's no real hover to fall back to — clear it so
              // a second tap actually closes the card.
              if (unpinning) setHoverId(null);
            }}
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
          onMouseEnter={() => keepHover(active.id)}
          onMouseLeave={dropHover}
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
