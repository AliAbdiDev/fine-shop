'use server';

import { type Products } from "@/core/types/entities.types";

import { type ProductQueryParams } from "./misc-utils";
import { api } from "../configs/api";

export const productsAction = async (p?: ProductQueryParams) => {
    return api.get<undefined, Products>("/product/", { query: p });
};