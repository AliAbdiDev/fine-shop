import { useInfiniteQuery } from "@tanstack/react-query";

import { type Category, type Categorys } from "@/core/types/entities.types";

import { categoryKeys, type ListParams } from "./keys";
import { api } from "../configs/api";
import { paginatedAdapter } from "../configs/fetcher/adapters";
import { type DrfPaginated } from "../configs/fetcher/types/contract.types";
import { unwrap } from "../configs/fetcher/unwrap";

/* -------------------- select types -------------------- */

export interface CategorySelectOption {
    label: string;
    value: string;
}

export interface CategoriesSelectResult {
    options: CategorySelectOption[];
    isLoading: boolean;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    onLoadMore: () => void;
}

/* -------------------- hook -------------------- */

type CategoryListParams = Omit<ListParams, "page">;

export function useCategoriesInfiniteSelect(
    params: CategoryListParams,
): CategoriesSelectResult {
    const query = useInfiniteQuery({
        queryKey: categoryKeys.list(params),
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const full = { ...params, page: pageParam };
            const res = await api.get<DrfPaginated<Category>, Categorys>(
                "/product/category/",
                { query: full, adapter: paginatedAdapter(full) },
            );
            const items = unwrap(res);

            return {
                items,
                nextPage: res.ok ? (res.meta?.next ?? null) : null,
            };
        },
        getNextPageParam: (last) => last.nextPage,
        select: (data) => data.pages.flatMap((p) => p.items),
    });

    return {
        options: query.data?.map((c) => ({ label: c?.name, value: c?.slug })) ?? [],
        isLoading: query.isLoading,
        isFetchingNextPage: query.isFetchingNextPage,
        hasNextPage: query.hasNextPage,
        onLoadMore: () => {
            if (query.hasNextPage && !query.isFetchingNextPage) {
                void query.fetchNextPage();
            }
        },
    };
}