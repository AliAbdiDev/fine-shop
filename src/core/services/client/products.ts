
import { isNullOrUndefined, isNumber } from "@sindresorhus/is";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


import { useAuthSelector } from "@/core/states/auth";
import { type Products, type Product, type ProductAttributes, type EntityId } from "@/core/types/entities.types";

import { attributeKeys, type ListParams, productKeys } from "./keys";
import { api, } from "../configs/api"
import { paginatedAdapter } from "../configs/fetcher/adapters";
import { type ApiError } from "../configs/fetcher/types/client.types";
import { type DrfPaginated } from "../configs/fetcher/types/contract.types";
import { unwrap } from "../configs/fetcher/unwrap";

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    const token = useAuthSelector.useToken();

    return useMutation({
        mutationFn: async (payload: FormData) =>
            unwrap(await api.post<void, Product>('/product/', payload, { token })),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
        meta: {
            toastMessage: (error) => {
                const apiError = error as ApiError;

                if (
                    apiError.code === 'VALIDATION_ERROR' &&
                    apiError.details?.name?.includes('product model with this name already exists.')
                ) {
                    return 'محصولی با این نام قبلا ایجاد شده است. نام محصول را عوض کنید.';
                }
                return null;
            },
        },
    });
};

export function useEditProduct({ id }: { id: EntityId | null; }) {
    const token = useAuthSelector.useToken();
    const queryClient = useQueryClient();

    const isId = isNumber(id)
    return useMutation({
        mutationFn: async (payload: FormData) => {
            if (isNullOrUndefined(isId)) throw new Error("id is required");
            return unwrap(await api.patch<Product, Product>(`/product/${id}/`, payload, { token }));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}

export function useProducts(p: ListParams) {

    return useQuery({
        queryKey: productKeys.list(p),
        queryFn: async () =>
            await api.get<DrfPaginated<Product>, Products>("/product/", {
                query: p,
                adapter: paginatedAdapter(p),
            })

    });
}

export function useProduct({ id, enabled = true }: { id: EntityId | null; enabled?: boolean }) {
    const isId = isNumber(id)
    return useQuery({
        queryKey: isId ? productKeys.detail(id) : [],
        queryFn: async () => {
            if (isNullOrUndefined(isId)) throw new Error("id is required");
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

export const useRemoveImageProduct = () => {
    const token = useAuthSelector.useToken();
    console.log("🚀 ~ useRemoveImageProduct ~ token:", token)
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: EntityId) => {
            return unwrap(await api.delete<Product, Product>(`/product/image/${payload}/`, undefined, { token }));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}