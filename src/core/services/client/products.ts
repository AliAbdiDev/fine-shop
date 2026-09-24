import { useMutation, useQuery } from "@tanstack/react-query"


import { type Product } from "@/core/types/entities.types";

import { productKeys } from "./keys";
import { api, drfPaginated } from "../configs/api"
import { type DrfPaginated } from "../configs/fetcher/types/contract.types";
import { unwrap } from "../configs/fetcher/unwrap";

export const useCreateProduct = () => {
    return useMutation({ mutationFn: (payload: FormData) => api.post<void, Product>('/product/', payload) },)
}

export function useProducts({ page, size }: { page: number, size: number }) {
    return useQuery({
        queryKey: productKeys.list({ page }),
        queryFn: async () =>
            unwrap(await api.get<DrfPaginated<Product>, Product[]>('/product/', {
                query: { count: page, },
                adapter: drfPaginated(page, size),
            }))
        ,
    });
}

export const useProductAttribute = () => {
    return useQuery({
        queryKey: productKeys.list(),
        queryFn: async () =>
            unwrap(await api.get<Product[]>('/product/types/'))
    });
}