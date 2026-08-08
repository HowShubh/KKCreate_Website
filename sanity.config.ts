import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { projectId, dataset } from "./src/sanity/env";

// Document types that should exist exactly once (edited in place, not listed).
const SINGLETONS = new Set(["siteSettings", "learnFormats", "catalogOrder"]);

// Studio config. Run locally with `npm run studio:dev`, deploy the editor
// to <project>.sanity.studio with `npm run studio:deploy`.
export default defineConfig({
  name: "kkcreate",
  title: "KK Create",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
            S.listItem()
              .title("Learn — Formats section")
              .id("learnFormats")
              .child(
                S.document()
                  .schemaType("learnFormats")
                  .documentId("learnFormats"),
              ),
            S.listItem()
              .title("Catalog order")
              .id("catalogOrder")
              .child(
                S.document()
                  .schemaType("catalogOrder")
                  .documentId("catalogOrder"),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !SINGLETONS.has(item.getId() ?? ""),
            ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    // The singleton can't be duplicated or deleted — only edited/published.
    actions: (input, context) =>
      SINGLETONS.has(context.schemaType)
        ? input.filter(({ action }) =>
            ["publish", "discardChanges", "restore"].includes(action ?? ""),
          )
        : input,
  },
});
