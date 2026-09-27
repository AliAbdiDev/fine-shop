import { isNumber } from "@sindresorhus/is";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


import { useAuthSelector } from "@/core/states/auth";
import { type Products, type Product, type ProductAttributes, type EntityId } from "@/core/types/entities.types";

import { attributeKeys, type ListParams, productKeys } from "./keys";
import { api, } from "../configs/api"
import { paginatedAdapter } from "../configs/fetcher/adapters";
import { type DrfPaginated } from "../configs/fetcher/types/contract.types";
import { unwrap } from "../configs/fetcher/unwrap";

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    const token = useAuthSelector.useToken()
    console.log("🚀 ~ useCreateProduct ~ token:", token)

    return useMutation({
        mutationFn: async (payload: FormData) => unwrap(await api.post<void, Product>('/product/', payload, { token })),
        onSuccess: () => {
            queryClient.invalidateQueries(({ queryKey: productKeys.lists() }))
        },
    },)
}

export function useProducts(p: ListParams) {

    return useQuery({
        queryKey: productKeys.list(p),
        queryFn: async () =>
            unwrap(
                await api.get<DrfPaginated<Product>, Products>("/product/", {
                    query: p,
                    adapter: paginatedAdapter(p),
                })
            ),
    });
}

export function useProduct({ id, enabled = true }: { id: EntityId | null; enabled?: boolean }) {
    const isId = isNumber(id)
    return useQuery({
        queryKey: isId ? productKeys.detail(id) : [],
        queryFn: async () => {
            if (!isId) throw new Error("id is required");
            return unwrap(await api.get<Product>(`/product/${id}/`));
        },
        enabled: enabled && isId,
    });
}

export const useAttributes = ({ enabled = true }: { enabled?: boolean }) => {
    return useQuery({
        queryKey: attributeKeys.all(),
        queryFn: async () =>
            unwrap(await api.get<ProductAttributes>('/product/types/')),
        enabled
    });
}