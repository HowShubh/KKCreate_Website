import { defineField, defineType } from "sanity";

// One video card in a Learn-page format stack (a podcast episode or an
// Instagram reel). Reused inside the `learnFormats` singleton's two arrays.
// The first video in each array is the featured card; the rest fan/stack
// behind it. Mapped to the `LearnVideo` shape in src/lib/learnFormats.ts.
export const learnVideo = defineType({
  name: "learnVideo",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description:
        'Optional. Short label shown on the featured card, e.g. "Dhruv Rathee, Part 2". Leave it empty to let the thumbnail speak for itself.',
    }),
    defineField({
      name: "views",
      title: "Views label",
      type: "string",
      description: 'e.g. "1.4M views" — free text, shown above the title.',
    }),
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      description: "Where the card links to (YouTube, Instagram, etc.).",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "thumbnail",
      type: "image",
      options: { hotspot: true },
      description:
        "Podcasts read best landscape (16:9); reels are portrait (9:16). If empty, the card shows a plain textured frame.",
    }),
  ],
  preview: {
    select: { title: "title", views: "views", url: "url", media: "thumbnail" },
    // Title is optional, so fall back to the URL — otherwise untitled rows all
    // read "Untitled" and can't be told apart in the array.
    prepare({ title, views, url, media }) {
      return { title: title || url || "Untitled video", subtitle: views, media };
    },
  },
});
