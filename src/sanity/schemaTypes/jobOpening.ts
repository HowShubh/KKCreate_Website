import { defineField, defineType } from "sanity";

// One open role on /careers. Deliberately tiny: the page is a plain list of
// role + location (+ an optional one-liner), and each row links straight to
// the application form (a Google Form), so the full brief lives there.
// Publish a role to list it; unpublish it once it's filled. Mapped in
// src/lib/careers.ts.
export const jobOpening = defineType({
  name: "jobOpening",
  title: "Job opening",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Role",
      type: "string",
      description: 'e.g. "Video Editor" or "Research Associate".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      type: "string",
      description: 'e.g. "Delhi" or "Remote".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      type: "string",
      description:
        "Optional. One short line under the role, e.g. \"Cut long-form films from field footage.\" Keep it under 120 characters.",
      validation: (r) => r.max(120),
    }),
    defineField({
      name: "applyUrl",
      title: "Application form link",
      type: "url",
      description: "The Google Form (or any URL) an applicant is sent to.",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "location" },
  },
});
