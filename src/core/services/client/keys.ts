import { type EntityId } from "@/core/types/entities.types";

type Prefix = "categories" | "products" | "users" | "attributes";

export type ListParams = { page?: number; pageSize?: number };

export function createKeys<P extends Prefix>(prefix: P) {
    return {
        all: () => [prefix] as const,

        lists: () => [prefix, "list"] as const,

        list: (params: ListParams) => ([prefix, "list", params] as const),

        details: () => [prefix, "detail"] as const,

        detail: (id: EntityId) => [prefix, "detail", id] as const,
    };
}

export const productKeys = createKeys("products");
export const categoryKeys = createKeys("categories");
export const userKeys = createKeys("users");
export const attributeKeys = createKeys("attributes");