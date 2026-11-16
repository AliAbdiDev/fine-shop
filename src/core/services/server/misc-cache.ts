"use cache";

import { cacheLife } from "next/cache";

import { type Products } from "@/core/types/entities.types";

import { api } from "../configs/api";
import { cacheTagWithTags } from "../shared/tages";

export const productsAsc = async () => {
  try {
    const r = await api.get<undefined, Products>("/product/", {
      query: { sort: "price_asc", pageSize: 6 },
    });

    if (r.ok && r.data) {
      cacheTagWithTags("product:price_asc");
      cacheLife("weeks");
      return r;
    }
    return { ok: false, data: [] } as const;
  } catch {
    return { ok: false, data: [] } as const;
  }
};

export const productsPopular = async () => {
  try {
    const r = await api.get<undefined, Products>("/product/", {
      query: { sort: "popular", pageSize: 6 },
    });

    if (r.ok && r.data) {
      cacheTagWithTags("product:popular");
      cacheLife("weeks");
      return r;
    }
    return { ok: false, data: [] } as const;
  } catch {
    return { ok: false, data: [] } as const;
  }
};
