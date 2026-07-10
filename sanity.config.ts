import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { projectId, dataset } from "./src/sanity/env";

// Studio config. Run locally with `npm run studio:dev`, deploy the editor
// to <project>.sanity.studio with `npm run studio:deploy`.
export default defineConfig({
  name: "kkcreate",
  title: "KK Create",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
