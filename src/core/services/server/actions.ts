"use server";

import { revalidateTag } from "next/cache";

import type { Tags } from "../shared/tages";

export async function revalidateTagWithTags(
  tag: Tags,
  profile: Parameters<typeof revalidateTag>[1],
) {
  revalidateTag(tag, profile);
}
