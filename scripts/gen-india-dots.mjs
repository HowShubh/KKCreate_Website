// Generates a dot-matrix India from the datameet composite boundary GeoJSON.
// Output: src/lib/india-dots.ts (dots + viewbox) and pin coords for cities.
//
// Usage:
//   curl -sL https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson \
//     -o scripts/india.geojson   (not committed — ~11 MB)
//   node scripts/gen-india-dots.mjs
import { readFileSync, writeFileSync } from "node:fs";

const SRC = new URL("./india.geojson", import.meta.url).pathname;
const geo = JSON.parse(readFileSync(SRC, "utf8"));

// Gather all outer rings of the MultiPolygon; mainland = largest by |area|.
const rings = [];
for (const f of geo.features) {
  const g = f.geometry;
  if (g.type === "MultiPolygon") for (const poly of g.coordinates) rings.push(poly[0]);
  else if (g.type === "Polygon") rings.push(g.coordinates[0]);
}
function ringArea(r) {
  let a = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++)
    a += (r[j][0] + r[i][0]) * (r[j][1] - r[i][1]);
  return Math.abs(a / 2);
}
rings.sort((r1, r2) => ringArea(r2) - ringArea(r1));
const mainland = rings[0];
console.log("rings:", rings.length, "mainland points:", mainland.length);

// Bounds of the mainland only (skip islands so the frame is tight).
let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
for (const [lon, lat] of mainland) {
  if (lon < minLon) minLon = lon;
  if (lon > maxLon) maxLon = lon;
  if (lat < minLat) minLat = lat;
  if (lat > maxLat) maxLat = lat;
}
console.log("bounds:", { minLon, maxLon, minLat, maxLat });

// Equirectangular projection with latitude aspect correction.
const midLat = ((minLat + maxLat) / 2) * (Math.PI / 180);
const lonSpan = maxLon - minLon;
const latSpan = maxLat - minLat;
const W = 100;
const H = Math.round(W * (latSpan / (lonSpan * Math.cos(midLat))) * 10) / 10;
const px = (lon) => ((lon - minLon) / lonSpan) * W;
const py = (lat) => ((maxLat - lat) / latSpan) * H;
console.log("viewbox:", W, "x", H);

// Downsample the ring for faster point-in-polygon (keep every Nth point —
// boundary detail beyond ~5k points doesn't change which grid dots fall inside).
const step = Math.max(1, Math.floor(mainland.length / 8000));
const ring = mainland.filter((_, i) => i % step === 0).map(([lon, lat]) => [px(lon), py(lat)]);
console.log("ring points used:", ring.length);

function inside(x, y) {
  let ins = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ins = !ins;
  }
  return ins;
}

// Dot grid.
const GRID = 1.9;
const dots = [];
for (let y = GRID / 2; y <= H; y += GRID) {
  for (let x = GRID / 2; x <= W; x += GRID) {
    if (inside(x, y)) dots.push([Math.round(x * 100) / 100, Math.round(y * 100) / 100]);
  }
}
console.log("dots:", dots.length);

// Pin coordinates for our cities.
const cities = {
  mumbai: [72.8777, 19.076],
  jaipur: [75.7873, 26.9124],
  varanasi: [82.9739, 25.3176],
  kolkata: [88.3639, 22.5726],
  meghalaya: [91.8933, 25.5788],
  bengaluru: [77.5946, 12.9716],
};
const pins = {};
for (const [name, [lon, lat]] of Object.entries(cities))
  pins[name] = [Math.round(px(lon) * 10) / 10, Math.round(py(lat) * 10) / 10];
console.log("pins:", JSON.stringify(pins, null, 2));

// Emit the TS module.
const flat = dots.map(([x, y]) => `${x},${y}`).join(" ");
const ts = `// AUTO-GENERATED — do not edit by hand.
// Dot-matrix of India's official external boundary (datameet composite
// GeoJSON), equirectangular projection, grid ${GRID}. Regenerate with the
// gen-dots script if the grid or projection changes.

export const INDIA_MAP_W = ${W};
export const INDIA_MAP_H = ${H};

// Geographic bounds of the projection (lon/lat ↔ map x/y). Used to project
// CMS geopoints onto the map and to unproject Studio clicks back to lat/lng.
export const INDIA_BOUNDS = {
  minLon: ${Math.round(minLon * 1e6) / 1e6},
  maxLon: ${Math.round(maxLon * 1e6) / 1e6},
  minLat: ${Math.round(minLat * 1e6) / 1e6},
  maxLat: ${Math.round(maxLat * 1e6) / 1e6},
} as const;

// "x,y" pairs separated by spaces — parsed once at module load.
const PACKED =
  "${flat}";

export const INDIA_DOTS: ReadonlyArray<readonly [number, number]> = PACKED.split(
  " ",
).map((p) => {
  const [x, y] = p.split(",");
  return [Number(x), Number(y)] as const;
});
`;
writeFileSync("/Users/shubhamsinha/Documents/GitHub/KKCreate_Website/src/lib/india-dots.ts", ts);
console.log("wrote src/lib/india-dots.ts");
