import { getCliClient } from "sanity/cli";

// Points the Learn page's two format links at the dedicated "learn" channels.
// The values live in the `learnFormats` singleton, so editing the fallbacks in
// src/lib/learnFormats.ts alone would NOT change the live site.
//
// Run:  npm run set:learn-links   (uses your `sanity login` session)
// Re-running is safe: it only patches these two fields.
//
// The same podcast URL drives both the hero's "Creators Podcast" button and the
// "Podcasts →" link under the episode stack.

const PODCAST_URL = "https://www.youtube.com/@learnbykk.create/videos";
const REELS_URL = "https://www.instagram.com/learn.kkcreate/";

const client = getCliClient({ apiVersion: "2025-01-01" });

async function run() {
  const before = await client.fetch<{
    _id: string;
    podcast?: string;
    reels?: string;
  } | null>(
    `*[_type == "learnFormats"][0]{ _id, "podcast": podcast.linkUrl, "reels": reels.linkUrl }`,
  );

  if (!before) {
    console.error(
      'No "learnFormats" document found. Open the Studio and save the "Learn — Formats section" once, then re-run.',
    );
    process.exit(1);
  }

  console.log(`before  podcast: ${before.podcast ?? "(unset)"}`);
  console.log(`before  reels:   ${before.reels ?? "(unset)"}`);

  await client
    .patch(before._id)
    .set({ "podcast.linkUrl": PODCAST_URL, "reels.linkUrl": REELS_URL })
    .commit();

  console.log(`after   podcast: ${PODCAST_URL}`);
  console.log(`after   reels:   ${REELS_URL}`);
  console.log(
    "\n✓ Updated. If the document had unpublished edits, publish it in the Studio.",
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
