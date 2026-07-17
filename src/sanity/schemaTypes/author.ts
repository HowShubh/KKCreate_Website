import { defineField, defineType } from "sanity";

// A photo-essay writer. Referenced from photoEssay documents; the bio card at
// the end of every essay and the byline row both read from here.
export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "avatar",
      type: "image",
      options: { hotspot: true },
      description: "Optional — initials are shown when empty.",
    }),
    defineField({
      name: "bio",
      type: "text",
      rows: 2,
      description:
        'One or two sentences for the card at the end of an essay, e.g. "Films and writes about the social realities of India."',
    }),
    defineField({
      name: "videoUrl",
      title: "Channel / video URL",
      type: "url",
      description:
        'Default target for the "Watch the video" button. An essay\'s own companion-video URL takes precedence.',
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "bio", media: "avatar" },
  },
});
