import { defineField, defineType } from "sanity";

// Singleton document (one per site). Holds the settings a non-technical editor
// changes from the Studio: default colour theme, social links, and the
// "get in touch" emails. Read by src/lib/settings.ts with a static fallback.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "defaultTheme",
      title: "Default theme (first visit)",
      type: "string",
      description:
        "The colour theme new visitors see on their first load, before they toggle it themselves.",
      options: {
        list: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
          { title: "Follow device setting", value: "system" },
        ],
        layout: "radio",
      },
      initialValue: "system",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "social",
      title: "Social links",
      description: "Shown in the home hero and the footer. Drag to reorder.",
      type: "array",
      of: [
        defineField({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: {
                list: [
                  { title: "YouTube", value: "youtube" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "LinkedIn", value: "linkedin" },
                ],
                layout: "dropdown",
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { platform: "platform", url: "url" },
            prepare({ platform, url }) {
              const labels: Record<string, string> = {
                youtube: "YouTube",
                instagram: "Instagram",
                facebook: "Facebook",
                linkedin: "LinkedIn",
              };
              return {
                title: platform ? (labels[platform] ?? platform) : "Social link",
                subtitle: url,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "contacts",
      title: "Get in touch",
      type: "object",
      options: { collapsible: false },
      fields: [
        defineField({
          name: "brands",
          title: "Brands — email",
          type: "string",
          validation: (r) => r.email(),
        }),
        defineField({
          name: "creators",
          title: "Creators — email",
          type: "string",
          validation: (r) => r.email(),
        }),
        defineField({
          name: "careers",
          title: "Careers — link to your openings page",
          type: "url",
          description:
            "Where the Careers card and footer link to. Leave it empty and the Careers link is hidden until you have a page to send people to.",
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
