import type { SchemaTypeDefinition } from "sanity";
import { catalogItem } from "./catalogItem";
import { siteSettings } from "./siteSettings";

// Add future document types here (photoEssay, vibeFrame, review…).
export const schemaTypes: SchemaTypeDefinition[] = [siteSettings, catalogItem];
