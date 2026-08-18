import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./src/sanity/env";

export default defineCliConfig({
  // Fall back to the literal ids so `sanity deploy` works even when the CLI
  // doesn't pick up .env.local (both values are public identifiers).
  api: {
    projectId: projectId || "rhehuwrr",
    dataset: dataset || "production",
  },
  // Hosted Studio at https://kkcreate.sanity.studio — host and app id are
  // pinned here so `sanity deploy` never stops to ask for either.
  studioHost: "kkcreate",
  deployment: { appId: "o2qadd0ff9ummr6v9btajca1" },
  // The Studio runs on Vite, which otherwise auto-loads the Next app's
  // postcss.config.mjs and can't parse its Tailwind v4 `plugins: ["..."]`
  // form. The Studio doesn't use Tailwind, so give Vite an empty PostCSS
  // config to stop it searching the project root.
  vite: (config: Record<string, unknown>) => ({
    ...config,
    css: { ...(config.css as object), postcss: {} },
  }),
});
