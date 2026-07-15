import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./src/sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  // The Studio runs on Vite, which otherwise auto-loads the Next app's
  // postcss.config.mjs and can't parse its Tailwind v4 `plugins: ["..."]`
  // form. The Studio doesn't use Tailwind, so give Vite an empty PostCSS
  // config to stop it searching the project root.
  vite: (config: Record<string, unknown>) => ({
    ...config,
    css: { ...(config.css as object), postcss: {} },
  }),
});
