import { cacheTag, revalidateTag } from "next/cache";

export type Tags = "product:price_asc" | "product:popular";
export const cacheTagWithTags = (tag: Tags) => cacheTag(tag);
export const revalidateTagWithTags = async (
  tag: Tags,
  profile: Parameters<typeof revalidateTag>[1],
) => {
  "use server";
  revalidateTag(tag, profile);
};
