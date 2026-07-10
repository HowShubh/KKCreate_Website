import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";

// `projectId` may be empty before configuration; the builder is only ever
// invoked when a Sanity image object exists (i.e. Sanity is configured).
const builder = createImageUrlBuilder({ projectId: projectId || "placeholder", dataset });

export function urlForImage(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source).auto("format").fit("max");
}
