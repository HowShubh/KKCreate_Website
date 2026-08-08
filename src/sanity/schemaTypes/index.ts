import type { SchemaTypeDefinition } from "sanity";
import { catalogItem } from "./catalogItem";
import { catalogOrder } from "./catalogOrder";
import { siteSettings } from "./siteSettings";
import { learnFormats } from "./learnFormats";
import { learnVideo } from "./learnVideo";
import { filmedPlace } from "./filmedPlace";
import { author } from "./author";
import { photoEssay } from "./photoEssay";

// Add future document types here (vibeFrame, review…).
export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  learnFormats,
  learnVideo,
  catalogItem,
  catalogOrder,
  filmedPlace,
  photoEssay,
  author,
];
