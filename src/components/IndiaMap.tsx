"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { FilmedPlace } from "@/lib/content";
import { INDIA_DOTS, INDIA_MAP_W, INDIA_MAP_H } from "@/lib/india-dots";

// Dotted India map with pins. Hovering a pin previews its video card; clicking
// pins the card open so the "Watch on YouTube" link is clickable. The dot
// matrix is pre-generated from the official India boundary GeoJSON (see
// src/lib/india-dots.ts); pin x/y live in the same projected space.

// The whole country is only ~576px wide, so every video shot in the same metro
// (Mumbai ×4, Delhi ×4, Kerala ×4) lands on nearly the same spot. Rather than
// nudging the coordinates in the CMS (a nudge big enough to be visible would
// move Delhi's pins into Haryana), overlapping pins are pushed apart here, at
// render time, and drawn at a small offset from their true position.
// Pin diameter in px. Must track the `h-3.5 w-3.5 sm:h-5 sm:w-5` classes on
// the pin button: the country shrinks on a phone but a fixed-size pin doesn't,
// so a smaller dot there keeps the clusters legible.
const PIN_PX_PHONE = 14;
const PIN_PX_WIDE = 20;
/** Tailwind's `sm` breakpoint — where the pin grows back to full size. */
const WIDE_QUERY = "(min-width: 40rem)";
/** How hard a pin is pulled back toward its true location each pass. */
const PULL = 0.06;
const PASSES = 80;

// Scroll-in animation. INDIA_DOTS runs row by row from the top of the map, so
// staggering by index sweeps the country in from Ladakh down to Kanyakumari.
// Keep the per-dot step small — at 1000+ dots it multiplies fast.
const DOT_STEP_MS = 1;
// Pins start just after the last dot's delay fires — so they begin dropping in
// while the final row is still settling, which keeps the reveal moving instead
// of stalling. Whole thing lands ~2.2s after the map scrolls into view.
const PIN_LEAD_IN_MS = 120;
const PIN_STEP_MS = 16;
const DOTS_SWEEP_MS = INDIA_DOTS.length * DOT_STEP_MS;

type Offsets = Record<string, [number, number]>;

/**
 * Pixel offsets that separate overlapping pins. Runs a short relaxation: pins
 * closer than one pin-width shove each other apart, while a weak spring pulls
 * every pin back toward where it really belongs — so pins move only as far as
 * they must. Works in pixel space, so it re-solves when the map is resized or
 * the pin size changes at the breakpoint.
 */
function spreadPins(
  places: FilmedPlace[],
  width: number,
  pinPx: number,
): Offsets {
  const minGap = pinPx + 1;
  const height = (width * INDIA_MAP_H) / INDIA_MAP_W;
  const home = places.map((p) => ({
    x: (p.x / INDIA_MAP_W) * width,
    y: (p.y / INDIA_MAP_H) * height,
  }));
  const at = home.map((h) => ({ ...h }));

  for (let pass = 0; pass < PASSES; pass++) {
    let moved = false;
    for (let i = 0; i < at.length; i++) {
      for (let j = i + 1; j < at.length; j++) {
        let dx = at[j].x - at[i].x;
        let dy = at[j].y - at[i].y;
        let d = Math.hypot(dx, dy);
        if (d >= minGap) continue;
        // Exactly coincident pins have no direction to separate along —
        // fan them out by index so the spread is stable across renders.
        if (d < 0.001) {
          const a = (i * 2 * Math.PI) / at.length;
          dx = Math.cos(a);
          dy = Math.sin(a);
          d = 1;
        }
        const push = (minGap - d) / 2 / d;
        at[i].x -= dx * push;
        at[i].y -= dy * push;
        at[j].x += dx * push;
        at[j].y += dy * push;
        moved = true;
      }
      at[i].x += (home[i].x - at[i].x) * PULL;
      at[i].y += (home[i].y - at[i].y) * PULL;
    }
    if (!moved) break;
  }

  const offsets: Offsets = {};
  places.forEach((p, i) => {
    offsets[p.id] = [at[i].x - home[i].x, at[i].y - home[i].y];
  });
  return offsets;
}

export function IndiaMap({ places }: { places: FilmedPlace[] }) {
  // The map is fluid up to max-w-xl, and pins are a fixed pixel size, so how
  // much they overlap depends on the rendered width — measure it and re-solve.
  const wrapper = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(576);
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mirror the pin's `sm:` size jump so the solver spaces pins by the size
  // they're actually drawn at.
  const [pinPx, setPinPx] = useState(PIN_PX_WIDE);
  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const sync = () => setPinPx(mq.matches ? PIN_PX_WIDE : PIN_PX_PHONE);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const offsets = useMemo(
    () => spreadPins(places, width, pinPx),
    [places, width, pinPx],
  );

  // Hold the dot sweep until the map is actually on screen, so it isn't spent
  // while the section is still below the fold. Fires once.
  const [swept, setSwept] = useState(false);
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSwept(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    <div
      ref={wrapper}
      className={`relative mx-auto w-full max-w-xl select-none ${
        swept ? "map-dots-in map-pins-in" : ""
      }`}
    >
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
          <circle
            key={i}
            cx={x}
            cy={y}
            r={0.55}
            fill="currentColor"
            className="map-dot"
            style={{ animationDelay: `${i * DOT_STEP_MS}ms` }}
          />
        ))}
      </svg>

      {/* Pins */}
      {places.map((p, i) => {
        const isActive = p.id === activeId;
        const [dx, dy] = offsets[p.id] ?? [0, 0];
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
            className={`map-pin absolute z-10 flex h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-transform hover:scale-125 sm:h-5 sm:w-5 ${
              isActive ? "bg-saffron" : "bg-content"
            }`}
            style={{
              left: `calc(${(p.x / INDIA_MAP_W) * 100}% + ${dx.toFixed(1)}px)`,
              top: `calc(${(p.y / INDIA_MAP_H) * 100}% + ${dy.toFixed(1)}px)`,
              animationDelay: `${DOTS_SWEEP_MS + PIN_LEAD_IN_MS + i * PIN_STEP_MS}ms`,
            }}
          >
            <span className="block h-1 w-1 rounded-full bg-canvas sm:h-1.5 sm:w-1.5" />
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
            left: `calc(${(active.x / INDIA_MAP_W) * 100}% + ${(offsets[active.id]?.[0] ?? 0).toFixed(1)}px)`,
            top: `calc(${(active.y / INDIA_MAP_H) * 100}% + ${(offsets[active.id]?.[1] ?? 0).toFixed(1)}px)`,
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
                className="object-cover"
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
