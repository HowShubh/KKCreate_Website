import { getCliClient } from "sanity/cli";
import {
  STATIC_AUTHORS,
  STATIC_PHOTO_ESSAYS,
} from "../src/lib/photoEssayContent";
import type { EssayBodyBlock, EssayImage } from "../src/lib/photoEssays";

// Imports the static fallback essays + authors into Sanity as editable
// documents. Photographs aren't uploaded (the fallback uses placeholders);
// editors attach real photos in the Studio — the site renders the textured
// placeholder card until they do.
// Run:  npm run seed:photo-essays   (uses your `sanity login` session)
// Re-running is safe: documents are createOrReplace'd by stable ids.

const client = getCliClient({ apiVersion: "2025-01-01" });

// Sanity image fields are required in the schema but can't be filled without
// binary uploads, so seeded docs simply omit them (Studio flags them to fill).
const imageStub = (_img: EssayImage) => undefined;

function seedBody(body: EssayBodyBlock[]): Record<string, unknown>[] {
  return body
    .map((block) => {
      switch (block._type) {
        case "block":
          return block as unknown as Record<string, unknown>;
        case "pullQuote":
          return { _type: "pullQuote", _key: block._key, quote: block.quote };
        case "essayImage":
          return {
            _type: "essayImage",
            _key: block._key,
            fullBleed: block.fullBleed ?? false,
            image: imageStub(block.image),
          };
        case "imagePair":
          return {
            _type: "imagePair",
            _key: block._key,
            left: imageStub(block.left),
            right: imageStub(block.right),
          };
        case "youtube":
          return {
            _type: "youtube",
            _key: block._key,
            url: `https://www.youtube.com/watch?v=${block.youtubeId}`,
            caption: block.caption,
          };
      }
    })
    .filter(Boolean) as Record<string, unknown>[];
}

async function run() {
  const tx = client.transaction();

  for (const a of STATIC_AUTHORS) {
    tx.createOrReplace({
      _id: a.id,
      _type: "author",
      name: a.name,
      bio: a.bio,
      videoUrl: a.videoUrl,
    });
  }

  for (const e of STATIC_PHOTO_ESSAYS) {
    tx.createOrReplace({
      _id: `photoEssay.${e.slug}`,
      _type: "photoEssay",
      title: e.title,
      slug: { _type: "slug", current: e.slug },
      dek: e.dek,
      excerpt: e.excerpt,
      location: e.location,
      publishedAt: e.publishedAt,
      author: { _type: "reference", _ref: e.author.id },
      body: seedBody(e.body),
      tags: e.tags,
      videoUrl: e.videoUrl,
      readMinutes: e.readMinutes,
    });
  }

  await tx.commit();
  console.log(
    `✓ Seeded ${STATIC_AUTHORS.length} authors and ${STATIC_PHOTO_ESSAYS.length} photo essays into Sanity.`,
  );
  console.log("  Open the Studio to attach cover/body photographs.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
