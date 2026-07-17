import type { SchemaTypeDefinition } from "sanity";
import { catalogItem } from "./catalogItem";
import { siteSettings } from "./siteSettings";
import { filmedPlace } from "./filmedPlace";
import { author } from "./author";
import { photoEssay } from "./photoEssay";

// Add future document types here (vibeFrame, review…).
export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  catalogItem,
  filmedPlace,
  photoEssay,
  author,
];
