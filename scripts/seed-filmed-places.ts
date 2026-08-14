import { getCliClient } from "sanity/cli";

// Replaces every filmedPlace document with the full video list from the
// channel spreadsheet (title + link + city/state), geocoded by hand.
//
// Run:  npm run seed:filmed-places
//
// Destructive: every existing filmedPlace (published and draft) is deleted
// first, so re-running is idempotent — the map ends up with exactly the
// pins below. Document ids are derived from the YouTube video id, so a
// re-run keeps the same documents rather than duplicating them.
//
// `title` and `views` are left empty on purpose: the site fills both from
// the YouTube Data API at render time (needs YOUTUBE_API_KEY), so titles
// and view counts stay current without editing the CMS.

const client = getCliClient({ apiVersion: "2025-01-01" });

type Seed = {
  /** Label on the pin card — "City, State". */
  city: string;
  lat: number;
  lng: number;
  /** YouTube video id; also the document id suffix. */
  video: string;
};

// Coordinates are the real place, not the projected map x/y — the site
// projects them onto the dot map at render time. Pins that sit on top of
// each other (Mumbai ×4, Delhi ×4, …) are fanned out visually by IndiaMap,
// so the stored coordinates stay geographically honest.
const PLACES: Seed[] = [
  { city: "Bir, Himachal Pradesh", lat: 32.0415, lng: 76.7196, video: "_ZlnaZCsLb4" },
  { city: "Hyderabad, Telangana", lat: 17.385, lng: 78.4867, video: "rFrkgnRqdZs" },
  { city: "Ramagundam, Telangana", lat: 18.7574, lng: 79.474, video: "mSeLiSbVY8w" },
  { city: "Amaravati, Andhra Pradesh", lat: 16.5131, lng: 80.5165, video: "yAlkXoqjeUI" },
  { city: "Thar Desert, Rajasthan", lat: 26.9157, lng: 70.9083, video: "-MQhcU3nlwA" },
  { city: "Thar Desert, Rajasthan", lat: 26.9157, lng: 70.9083, video: "l9l-8aFiFHY" },
  { city: "Karol Bagh, Delhi", lat: 28.6519, lng: 77.1909, video: "aClbOiMXbWU" },
  { city: "Ghazipur, Delhi", lat: 28.6203, lng: 77.326, video: "-ugSZT7LfUQ" },
  { city: "Delhi", lat: 28.6139, lng: 77.209, video: "gvslIN75jLE" },
  { city: "Mayapuri, Delhi", lat: 28.6289, lng: 77.1258, video: "dQdefVGV99U" },
  { city: "Mawsynram & Cherrapunji, Meghalaya", lat: 25.2986, lng: 91.5822, video: "RPassbDKT4s" },
  { city: "Dhanbad, Jharkhand", lat: 23.7957, lng: 86.4304, video: "XopdRESIJc4" },
  { city: "Jadugora, Jharkhand", lat: 22.6547, lng: 86.3486, video: "-xsc_m10YX8" },
  { city: "Kannauj, Uttar Pradesh", lat: 27.055, lng: 79.919, video: "KZeGwqaKe8k" },
  { city: "Lucknow, Uttar Pradesh", lat: 26.8467, lng: 80.9462, video: "ejsHGGxiqT8" },
  { city: "Varanasi, Uttar Pradesh", lat: 25.3176, lng: 82.9739, video: "rQxAV0xZ-VE" },
  { city: "Lucknow, Uttar Pradesh", lat: 26.8467, lng: 80.9462, video: "CQJ86pejzTU" },
  { city: "Kochi, Kerala", lat: 9.9312, lng: 76.2673, video: "CrsvmKVYHjY" },
  { city: "Aranmula, Kerala", lat: 9.3167, lng: 76.6833, video: "2JEF-_aJA_4" },
  { city: "Alleppey, Kerala", lat: 9.4981, lng: 76.3388, video: "zNEzWUhe9r8" },
  { city: "Munnar, Kerala", lat: 10.0889, lng: 77.0595, video: "V_wANgjOeL8" },
  { city: "Mumbai, Maharashtra", lat: 19.076, lng: 72.8777, video: "rU4V46zXrQM" },
  { city: "Mumbai, Maharashtra", lat: 19.076, lng: 72.8777, video: "I9r97uKBjuA" },
  { city: "Mumbai, Maharashtra", lat: 19.076, lng: 72.8777, video: "WMRXEwY6eVw" },
  { city: "Mumbai, Maharashtra", lat: 19.076, lng: 72.8777, video: "96EePUQhV5U" },
  { city: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567, video: "rfc38bcR74E" },
  { city: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567, video: "JNhY3n896y8" },
  { city: "Srinagar, Jammu & Kashmir", lat: 34.117, lng: 74.862, video: "EV5kzqER4g8" },
  { city: "Uri, Jammu & Kashmir", lat: 34.08, lng: 74.05, video: "Enw6Hb__U9k" },
  { city: "Dras, Ladakh", lat: 34.4269, lng: 75.755, video: "m0dCJMViZLA" },
  { city: "Leh, Ladakh", lat: 34.1526, lng: 77.5771, video: "Xq_NR-ZZMg0" },
  { city: "Churachandpur, Manipur", lat: 24.3333, lng: 93.6833, video: "CvBB5tI3idk" },
  { city: "Bishnupur, Manipur", lat: 24.628, lng: 93.767, video: "cuQ1rRPhyGU" },
  { city: "Gurgaon, Haryana", lat: 28.4595, lng: 77.0266, video: "NfCZ1Y-gz2w" },
  { city: "Panipat, Haryana", lat: 29.3909, lng: 76.9635, video: "Im9rL_V6Jhg" },
  // Approximate — "Jawaniya" wasn't resolvable to a single village, so this
  // sits on the Ganga flood belt in Saran district. Re-click it in the Studio.
  { city: "Jawaniya, Bihar", lat: 25.7, lng: 84.75, video: "EqNK_MMenA0" },
  { city: "Bastar, Chhattisgarh", lat: 19.0748, lng: 82.0037, video: "caQ76t3AkMA" },
  { city: "Bijapur, Chhattisgarh", lat: 18.794, lng: 80.77, video: "JhC88mi8uZw" },
  { city: "Rajkot, Gujarat", lat: 22.3039, lng: 70.8022, video: "vPHMFbnjNW4" },
  { city: "Ahmedabad, Gujarat", lat: 23.0225, lng: 72.5714, video: "dm9H-vRgXuk" },
  { city: "Kutch, Gujarat", lat: 23.7337, lng: 69.8597, video: "TdYCKNtgnHE" },
  { city: "Bishnupur, West Bengal", lat: 23.07, lng: 87.32, video: "YSMFWu3u0VQ" },
];

async function run() {
  const existing = await client.fetch<string[]>(
    `*[_type == "filmedPlace"]._id`,
  );
  console.log(`Deleting ${existing.length} existing filmed places…`);
  // Query delete also catches drafts, which the id list above excludes.
  await client.delete({ query: `*[_type == "filmedPlace"]` });
  await client.delete({
    query: `*[_id in path("drafts.**") && _type == "filmedPlace"]`,
  });

  const tx = PLACES.reduce(
    (t, p) =>
      t.createOrReplace({
        // "v" prefix because Sanity id segments can't start with a hyphen and
        // some YouTube ids do (e.g. "-MQhcU3nlwA").
        _id: `filmedPlace.v${p.video}`,
        _type: "filmedPlace",
        city: p.city,
        url: `https://www.youtube.com/watch?v=${p.video}`,
        location: { _type: "geopoint", lat: p.lat, lng: p.lng },
      } as never),
    client.transaction(),
  );
  await tx.commit();

  console.log(`✓ Seeded ${PLACES.length} filmed places.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
