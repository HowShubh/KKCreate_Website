import { getCliClient } from "sanity/cli";
import { FILMED_PLACES } from "../src/lib/content";

// One-off import of the demo map pins into Sanity so they become editable
// (and deletable) in the Studio like any other content.
// Run:  npx sanity exec scripts/seed-places.ts --with-user-token
// Re-running is safe: documents are createOrReplace'd by a stable id.

const client = getCliClient({ apiVersion: "2025-01-01" });

// Real coordinates for the demo places (the static x/y are projected values,
// not geography — the CMS stores true lat/lng).
const COORDS: Record<string, { lat: number; lng: number }> = {
  mumbai: { lat: 19.076, lng: 72.8777 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  varanasi: { lat: 25.3176, lng: 82.9739 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  meghalaya: { lat: 25.5788, lng: 91.8933 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
};

async function uploadThumb(url: string, filename: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return client.assets.upload("image", buf, {
    filename: `${filename}.jpg`,
    contentType: "image/jpeg",
  });
}

async function run() {
  for (const place of FILMED_PLACES) {
    const coords = COORDS[place.id];
    if (!coords) {
      console.warn(`! no coords for "${place.id}" — skipped`);
      continue;
    }

    let thumbnail: unknown;
    try {
      const asset = await uploadThumb(place.thumbnail, place.id);
      thumbnail = {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      };
      console.log(`  uploaded thumbnail for ${place.city}`);
    } catch (err) {
      console.warn(`! thumbnail failed for ${place.city} — seeding without`, err);
    }

    await client.createOrReplace({
      _id: `filmedPlace.${place.id}`,
      _type: "filmedPlace",
      city: place.city,
      title: place.title,
      views: place.views,
      url: place.url,
      location: { _type: "geopoint", ...coords },
      ...(thumbnail ? { thumbnail } : {}),
    } as never);
    console.log(`✓ ${place.city}`);
  }
  console.log(`Done — ${FILMED_PLACES.length} filmed places seeded.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
