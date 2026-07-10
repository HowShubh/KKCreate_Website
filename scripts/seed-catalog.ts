import { getCliClient } from "sanity/cli";
import { CATALOG, FLAGSHIP } from "../src/lib/content";

// One-off import of the current static catalog into Sanity so nothing is lost.
// Run:  npm run seed:catalog   (uses your `sanity login` session — no token needed)
// Re-running is safe: it createOrReplaces documents by a stable id.

const client = getCliClient({ apiVersion: "2025-01-01" });

const priceToAmount = (price: string): number =>
  Number(price.replace(/[^\d]/g, "")) || 0;

async function run() {
  const tx = client.transaction();

  CATALOG.forEach((item, index) => {
    const doc: Record<string, unknown> = {
      _id: `catalog.${item.id}`,
      _type: "catalogItem",
      title: item.title,
      type: item.type,
      topic: item.topic,
      description: item.description,
      priceAmount: priceToAmount(item.price),
      duration: item.duration,
      rating: item.rating,
      enrolled: item.enrolled,
      newlyLaunched: item.newlyLaunched ?? false,
      flagship: item.flagship ?? false,
      enrollUrl: item.enrollUrl,
      knowMoreUrl: item.knowMoreUrl,
      order: index,
    };
    if (item.flagship) {
      doc.flagshipKicker = FLAGSHIP.kicker;
      doc.flagshipPointers = FLAGSHIP.pointers;
    }
    tx.createOrReplace(doc as never);
  });

  await tx.commit();
  console.log(`✓ Seeded ${CATALOG.length} catalog items into Sanity.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
