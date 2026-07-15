import { defineField, defineType } from "sanity";
import { IndiaGeopointInput } from "../components/IndiaGeopointInput";
import { isWithinIndia } from "../../lib/india-projection";

// A pin on the home page's "Where we've filmed" India map. The location is
// picked by clicking the same dotted map in the Studio (IndiaGeopointInput);
// the site projects it back onto the map at render time.
export const filmedPlace = defineType({
  name: "filmedPlace",
  title: "Filmed place",
  type: "document",
  fields: [
    defineField({
      name: "city",
      title: "Place name",
      type: "string",
      description: 'Shown on the card, e.g. "Varanasi" or "Tawang".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Location on the map",
      type: "geopoint",
      components: { input: IndiaGeopointInput },
      validation: (r) =>
        r.required().custom((v?: { lat?: number; lng?: number }) => {
          if (!v || typeof v.lat !== "number" || typeof v.lng !== "number")
            return "Click the map to place the pin.";
          return isWithinIndia(v.lat, v.lng)
            ? true
            : "That point is outside India — click on the map again.";
        }),
    }),
    defineField({
      name: "title",
      title: "Video title",
      type: "string",
      description:
        "Optional — leave empty to use the video's own YouTube title (site needs a YOUTUBE_API_KEY). Fill in to show a custom/shorter label.",
    }),
    defineField({
      name: "views",
      title: "Views label",
      type: "string",
      description:
        'e.g. "2.1M views" — or leave empty to auto-fetch the live count from YouTube (site needs a YOUTUBE_API_KEY).',
    }),
    defineField({
      name: "url",
      title: "YouTube URL",
      type: "url",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "thumbnail",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional — if left empty, the video's own YouTube thumbnail is used.",
    }),
  ],
  preview: {
    select: { title: "city", subtitle: "title", media: "thumbnail" },
  },
});
