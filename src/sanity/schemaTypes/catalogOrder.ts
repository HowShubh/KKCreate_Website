import { defineField, defineType } from "sanity";

// A single document whose only job is to hold the running order of the catalog.
// Sanity arrays are drag-to-reorder out of the box, so editors move a row
// instead of hand-editing a number on every item. Anything missing from the
// list still shows up — it just falls to the end (see src/lib/catalog.ts).
export const catalogOrder = defineType({
  name: "catalogOrder",
  title: "Catalog order",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Drag to reorder",
      type: "array",
      of: [{ type: "reference", to: [{ type: "catalogItem" }] }],
      description:
        "The order cards appear in on /catalog (Featured) and in the 4-item previews on Home and Learn. Drag a row by its handle to move it up or down. New items you don't add here appear at the end.",
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare({ items }) {
      const n = Array.isArray(items) ? items.length : 0;
      return { title: "Catalog order", subtitle: `${n} item${n === 1 ? "" : "s"} ordered` };
    },
  },
});
