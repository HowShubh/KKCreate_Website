// Relative import (not "@/…") so the Sanity Studio's Vite build can bundle
// this module too — the Studio doesn't resolve Next's path aliases.
import { INDIA_BOUNDS, INDIA_MAP_W, INDIA_MAP_H } from "./india-dots";

// Converts between geographic coordinates and the India map's projected
// x/y space. Must mirror the math in scripts/gen-india-dots.mjs exactly.

const lonSpan = INDIA_BOUNDS.maxLon - INDIA_BOUNDS.minLon;
const latSpan = INDIA_BOUNDS.maxLat - INDIA_BOUNDS.minLat;

/** lat/lng → map x/y (the space INDIA_DOTS and pins live in). */
export function projectLatLng(lat: number, lng: number): { x: number; y: number } {
  return {
    x: ((lng - INDIA_BOUNDS.minLon) / lonSpan) * INDIA_MAP_W,
    y: ((INDIA_BOUNDS.maxLat - lat) / latSpan) * INDIA_MAP_H,
  };
}

/** map x/y → lat/lng (used by the Studio's click-to-place input). */
export function unprojectXY(x: number, y: number): { lat: number; lng: number } {
  return {
    lng: INDIA_BOUNDS.minLon + (x / INDIA_MAP_W) * lonSpan,
    lat: INDIA_BOUNDS.maxLat - (y / INDIA_MAP_H) * latSpan,
  };
}

/** Loose India bounding box — keeps mis-clicks/typos from floating in the sea. */
export function isWithinIndia(lat: number, lng: number): boolean {
  return (
    lat >= INDIA_BOUNDS.minLat - 0.5 &&
    lat <= INDIA_BOUNDS.maxLat + 0.5 &&
    lng >= INDIA_BOUNDS.minLon - 0.5 &&
    lng <= INDIA_BOUNDS.maxLon + 0.5
  );
}
