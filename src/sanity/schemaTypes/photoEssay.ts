import { defineArrayMember, defineField, defineType } from "sanity";

// A long-form photo essay. The body is portable text interleaved with custom
// visual blocks that mirror the editorial layouts on the site:
//   essayImage — single photograph (standard width or full-bleed)
//   imagePair  — two photographs side by side (portrait + landscape)
//   pullQuote  — large italic quote with the saffron rule
//   youtube    — embedded companion clip
const imageWithCaption = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        description: "Describes the photo for screen readers and SEO.",
      }),
      defineField({ name: "caption", type: "string" }),
    ],
    validation: (r) => r.required(),
  });

export const photoEssay = defineType({
  name: "photoEssay",
  title: "Photo essay",
  type: "document",
  groups: [
    { name: "story", title: "Story", default: true },
    { name: "meta", title: "Meta" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "story",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "story",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "dek",
      title: "Dek (standfirst)",
      type: "text",
      rows: 2,
      group: "story",
      description:
        "The italic line under the title, e.g. “A Khasi village has been training ficus roots across rivers for two hundred years.”",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      group: "story",
      description:
        "Summary shown on the listing page. Leave empty to reuse the dek.",
    }),
    defineField({
      name: "location",
      type: "string",
      group: "meta",
      description: 'Shown as the kicker, e.g. "Mawlynnong, Meghalaya".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published",
      type: "date",
      group: "meta",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      group: "meta",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "cover",
      title: "Cover (listing thumbnail)",
      type: "image",
      options: { hotspot: true },
      description:
        "Shown on the photo-essays listing and link previews only — never inside the article.",
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
        defineField({ name: "caption", type: "string" }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      type: "array",
      group: "story",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Pull quote", value: "pullQuote" },
          ],
          lists: [],
          marks: {
            decorators: [
              { title: "Italic", value: "em" },
              { title: "Bold", value: "strong" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({ name: "href", type: "url", validation: (r) => r.required() }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          name: "essayImage",
          title: "Photograph",
          type: "object",
          fields: [
            imageWithCaption("image", "Photograph"),
            defineField({
              name: "fullBleed",
              title: "Full-bleed (edge to edge)",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { media: "image", caption: "image.caption", fullBleed: "fullBleed" },
            prepare: ({ media, caption, fullBleed }) => ({
              title: caption || "Photograph",
              subtitle: fullBleed ? "Full-bleed" : "Standard width",
              media,
            }),
          },
        }),
        defineArrayMember({
          name: "imagePair",
          title: "Photo pair",
          type: "object",
          description: "Two photos side by side — the left column is narrower.",
          fields: [
            imageWithCaption("left", "Left (narrow)"),
            imageWithCaption("right", "Right (wide)"),
          ],
          preview: {
            select: { media: "left", caption: "left.caption" },
            prepare: ({ media, caption }) => ({
              title: caption || "Photo pair",
              subtitle: "Two photos side by side",
              media,
            }),
          },
        }),
        defineArrayMember({
          name: "pullQuote",
          title: "Pull quote",
          type: "object",
          fields: [
            defineField({
              name: "quote",
              type: "text",
              rows: 3,
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "quote" },
            prepare: ({ title }) => ({ title, subtitle: "Pull quote" }),
          },
        }),
        defineArrayMember({
          name: "socialEmbed",
          title: "Tweet / Instagram embed",
          type: "object",
          fields: [
            defineField({
              name: "url",
              title: "Post URL",
              type: "url",
              description: "A tweet (twitter.com / x.com) or Instagram post/reel link.",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "url" },
            prepare: ({ title }) => ({ title, subtitle: "Social embed" }),
          },
        }),
        defineArrayMember({
          name: "youtube",
          title: "YouTube video",
          type: "object",
          fields: [
            defineField({
              name: "url",
              title: "YouTube URL",
              type: "url",
              validation: (r) => r.required(),
            }),
            defineField({ name: "caption", type: "string" }),
          ],
          preview: {
            select: { title: "caption", subtitle: "url" },
            prepare: ({ title, subtitle }) => ({
              title: title || "YouTube video",
              subtitle,
            }),
          },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "tags",
      type: "array",
      group: "meta",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: 'End-of-essay pills, e.g. "Meghalaya", "Living infrastructure".',
    }),
    defineField({
      name: "videoUrl",
      title: "Companion video URL",
      type: "url",
      group: "meta",
      description:
        '"Watch the video" button target. Falls back to the author\'s channel URL.',
    }),
    defineField({
      name: "readMinutes",
      title: "Read time (minutes)",
      type: "number",
      group: "meta",
      description: "Leave empty to auto-compute from the body length.",
      validation: (r) => r.min(1).integer(),
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      location: "location",
      date: "publishedAt",
      media: "cover",
    },
    prepare({ title, location, date, media }) {
      return {
        title,
        subtitle: [location, date].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
