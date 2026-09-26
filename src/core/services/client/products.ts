import { useMutation, useQuery } from "@tanstack/react-query"


import { type Products, type Product, type ProductAttributes } from "@/core/types/entities.types";

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
            unwrap(await api.get<DrfPaginated<Product>, Products>('/product/', {
                query: { count: page, },
                adapter: drfPaginated(page, size),
            }))
        ,
    });
}

export function useProduct({ id, enabled = true }: { id: string | null; enabled?: boolean }) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: async () => {
            if (!id) throw new Error("id is required");
            return unwrap(await api.get<Product>(`/product/${id}/`));
        },
        enabled: enabled && !!id,
    });
}

export const useAttributes = ({ enabled = true }: { enabled?: boolean }) => {
    return useQuery({
        queryKey: productKeys.list(),
        queryFn: async () =>
            unwrap(await api.get<ProductAttributes>('/product/types/')),
        enabled
    });
}