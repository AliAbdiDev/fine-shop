import type { EntityId } from "@/core/types/entities.types";

export type ListParams = {
  page?: number;
  pageSize: number;
  search?: string;
  [key: string]: unknown;
};
type Prefix = string;

export function createKeys<P extends Prefix>(prefix: P) {
  return {
    all: () => [prefix] as const,
    lists: () => [prefix, "list"] as const,
    list: (params: ListParams) => [prefix, "list", params] as const,
    details: () => [prefix, "detail"] as const,
    detail: (id: EntityId) => [prefix, "detail", id] as const,
  };
}

/* ============================================================
 * Key instances
 * ============================================================ */
export const productKeys = createKeys("product");
export const userKeys = createKeys("user");
export const profileKeys = createKeys("profile");
export const attributeKeys = createKeys("attribute");
export const categoryKeys = createKeys("category");
