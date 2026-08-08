import { getCliClient } from "sanity/cli";

// Builds the "Catalog order" document from whatever order the catalog is in
// today, so switching from the old per-item `order` number to the drag-to-
// reorder list doesn't reshuffle the site.
//
// Run:  npm run seed:catalog-order   (uses your `sanity login` session)
// Re-running is safe: it appends only items missing from the list and never
// reorders what's already there.

const client = getCliClient({ apiVersion: "2025-01-01" });

type Item = { _id: string; title: string; order?: number };

async function run() {
  const items = await client.fetch<Item[]>(
    // Published documents only — drafts carry a `drafts.` prefix and would
    // otherwise be listed twice.
    `*[_type == "catalogItem" && !(_id in path("drafts.**"))]{ _id, title, order }
       | order(coalesce(order, 9999) asc, title asc)`,
  );

  if (!items.length) {
    console.log("No catalog items found — nothing to order.");
    return;
  }

  const existing = await client.fetch<string[] | null>(
    `*[_type == "catalogOrder"][0].items[]._ref`,
  );
  const already = new Set(existing ?? []);
  const missing = items.filter((i) => !already.has(i._id));

  if (existing && !missing.length) {
    console.log(`✓ Catalog order already covers all ${items.length} items.`);
    return;
  }

  const refs = [...(existing ?? []), ...missing.map((i) => i._id)].map((id) => ({
    _key: id.replace(/[^a-zA-Z0-9]/g, ""),
    _type: "reference",
    _ref: id,
  }));

  await client.createOrReplace({
    _id: "catalogOrder",
    _type: "catalogOrder",
    items: refs,
  } as never);

  console.log(
    `✓ Catalog order set — ${refs.length} items (${missing.length} added).`,
  );
  missing.forEach((i, n) => console.log(`   ${already.size + n + 1}. ${i.title}`));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
