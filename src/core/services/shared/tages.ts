import { cacheTag } from "next/cache";

export type Tags = "product:price_asc" | "product:popular";
export const cacheTagWithTags = (tag: Tags) => cacheTag(tag);
