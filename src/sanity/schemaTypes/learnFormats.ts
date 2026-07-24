import { defineField, defineType, type FieldDefinition } from "sanity";

// Singleton for the Learn page's "However you learn, we're already there"
// section. Holds two format columns — podcasts (a landscape episode stack)
// and reels (a portrait fan) — each with its own copy and an ordered list of
// videos. Read by src/lib/learnFormats.ts with a static fallback.

/** Shared fields for one format column (podcast or reels). */
function formatGroup(opts: {
  name: string;
  title: string;
  kicker: string;
  heading: string;
  description: string;
  linkLabel: string;
  videosHelp: string;
  maxVideos: number;
}): FieldDefinition {
  return defineField({
    name: opts.name,
    title: opts.title,
    type: "object",
    options: { collapsible: true, collapsed: false },
    fields: [
      defineField({
        name: "kicker",
        title: "Kicker (italic prompt)",
        type: "string",
        initialValue: opts.kicker,
      }),
      defineField({
        name: "heading",
        type: "string",
        initialValue: opts.heading,
        validation: (r) => r.required(),
      }),
      defineField({
        name: "description",
        type: "text",
        rows: 2,
        initialValue: opts.description,
      }),
      defineField({
        name: "linkLabel",
        title: "Link label",
        type: "string",
        initialValue: opts.linkLabel,
        description: 'The arrow link text, e.g. "Podcasts" or "Reels".',
      }),
      defineField({
        name: "linkUrl",
        title: "Link URL",
        type: "url",
        description: "Where the arrow link (and the whole stack) points.",
      }),
      defineField({
        name: "videos",
        title: "Videos",
        type: "array",
        of: [{ type: "learnVideo" }],
        description: opts.videosHelp,
        validation: (r) => r.max(opts.maxVideos),
      }),
    ],
    preview: {
      select: { heading: "heading", videos: "videos" },
      prepare({ heading, videos }) {
        const count = Array.isArray(videos) ? videos.length : 0;
        return {
          title: heading || opts.title,
          subtitle: `${count} video${count === 1 ? "" : "s"}`,
        };
      },
    },
  });
}

export const learnFormats = defineType({
  name: "learnFormats",
  title: "Learn — Formats section",
  type: "document",
  fields: [
    defineField({
      name: "sectionHeading",
      title: "Section heading",
      type: "string",
      description: 'Bold part of the heading, e.g. "However you learn,".',
      initialValue: "However you learn,",
    }),
    defineField({
      name: "sectionHeadingAccent",
      title: "Section heading — italic accent",
      type: "string",
      description: 'Saffron italic part, e.g. "we’re already there".',
      initialValue: "we’re already there",
    }),
    formatGroup({
      name: "podcast",
      title: "Podcasts (left column)",
      kicker: "Got an hour?",
      heading: "Podcasts with creators",
      description: "conversations that help you learn content and distribution",
      linkLabel: "Podcasts",
      videosHelp:
        "Add 1–5 episodes. The first is the featured landscape card; the rest stack behind it. Use landscape (16:9) thumbnails.",
      maxVideos: 5,
    }),
    formatGroup({
      name: "reels",
      title: "Reels (right column)",
      kicker: "Got 90 seconds?",
      heading: "Daily lessons for creators",
      description:
        "short-form videos that teach content creation and distribution",
      linkLabel: "Reels",
      videosHelp:
        "Add up to 5 reels. The first is the featured center card; the next four fan out behind it, two per side. Use portrait (9:16) thumbnails.",
      maxVideos: 5,
    }),
  ],
  preview: { prepare: () => ({ title: "Learn — Formats section" }) },
});
