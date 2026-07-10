import { defineField, defineType } from "sanity";

// Mirrors the `CatalogItem` shape in src/lib/content.ts. The `type`/`topic`
// option lists are duplicated here (not imported) so the Studio bundle stays
// independent of the app's module aliases. Keep them in sync with
// CATALOG_TYPES / CATALOG_TOPICS if you add a value.
export const catalogItem = defineType({
  name: "catalogItem",
  title: "Catalog item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "type",
      type: "string",
      options: {
        list: ["Course", "Workshop", "Ebook", "Tools"],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "topic",
      type: "string",
      options: {
        list: ["AI", "YouTube", "Instagram", "Money", "Writing"],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "priceAmount",
      title: "Price (₹)",
      type: "number",
      description: "Whole rupees, e.g. 4999 — shown as ₹4,999.",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "duration",
      type: "string",
      description: 'e.g. "1 hr 3 min", "2 days · live", "48 pages"',
    }),
    defineField({
      name: "rating",
      type: "number",
      validation: (r) => r.min(0).max(5).precision(1),
    }),
    defineField({
      name: "enrolled",
      type: "string",
      description: 'e.g. "9k+"',
    }),
    defineField({
      name: "image",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      description: "Optional. Used for the flagship block; cards use a colour wash.",
    }),
    defineField({
      name: "newlyLaunched",
      title: 'Show "Newly launched" ribbon',
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "flagship",
      title: "Flagship course",
      type: "boolean",
      initialValue: false,
      description: "Mark exactly one item as the flagship (Home & Learn hero).",
    }),
    defineField({
      name: "flagshipKicker",
      title: "Flagship — kicker",
      type: "string",
      hidden: ({ parent }) => !parent?.flagship,
    }),
    defineField({
      name: "flagshipPointers",
      title: "Flagship — bullet points",
      type: "array",
      of: [{ type: "string" }],
      hidden: ({ parent }) => !parent?.flagship,
    }),
    defineField({ name: "enrollUrl", title: "Enroll URL", type: "url" }),
    defineField({ name: "knowMoreUrl", title: "Know-more URL", type: "url" }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers appear first (the default 'featured' order).",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", type: "type", media: "image", price: "priceAmount" },
    prepare({ title, type, media, price }) {
      return {
        title,
        subtitle: [type, price ? `₹${price}` : null].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
