import type { SchemaTypeDefinition } from "sanity";
import { catalogItem } from "./catalogItem";

// Add future document types here (photoEssay, siteSettings, vibeFrame, review…).
export const schemaTypes: SchemaTypeDefinition[] = [catalogItem];
