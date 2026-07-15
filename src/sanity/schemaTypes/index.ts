import type { SchemaTypeDefinition } from "sanity";
import { catalogItem } from "./catalogItem";
import { siteSettings } from "./siteSettings";
import { filmedPlace } from "./filmedPlace";

// Add future document types here (photoEssay, vibeFrame, review…).
export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  catalogItem,
  filmedPlace,
];
