type Prefix = "categories" | "products" | "users";

type ListParams = Record<string, unknown>;
type EntityId = string | number;

export type QueryKeys<P extends Prefix> = {
    all: readonly [P];
    list: (params?: ListParams) => readonly [P, "list", ListParams];
    detail: (id: EntityId | null) => readonly [P, "detail", EntityId | null];
};

const productKeys: QueryKeys<"products"> = {
    all: ["products"],
    list: (params) => ["products", "list", params ?? {}],
    detail: (id) => ["products", "detail", id],
};

const categoryKeys: QueryKeys<"categories"> = {
    all: ["categories"],
    list: (params) => ["categories", "list", params ?? {}],
    detail: (id) => ["categories", "detail", id],
};

export { productKeys, categoryKeys };