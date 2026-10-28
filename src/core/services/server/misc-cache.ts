"use cache";

import { cacheLife } from "next/cache";

import { type Products } from "@/core/types/entities.types";

import { api } from "../configs/api";
import { cacheTagWithTags } from "../shared/tages";

export const productsAsc = async () => {
  const r = await api.get<undefined, Products>("/product/", {
    query: { sort: "price_asc", pageSize: 6 },
  });

  if (r.ok && r.data) {
    cacheTagWithTags("product:price_asc");
    cacheLife("weeks");
  }
  return r;
};

export const productsPopular = async () => {
  const r = await api.get<undefined, Products>("/product/", {
    query: { sort: "popular", pageSize: 6 },
  });

  if (r.ok && r.data) {
    cacheTagWithTags("product:popular");
    cacheLife("weeks");
  }
  return r;
};
