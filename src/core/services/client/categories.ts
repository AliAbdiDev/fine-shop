import { useInfiniteQuery } from "@tanstack/react-query";

import { type Categorys } from "@/core/types/entities.types";

import { categoryKeys, type ListParams } from "./keys";
import { api } from "../configs/api";
import { unwrap } from "../configs/fetcher/unwrap";

/* -------------------- select types -------------------- */

export interface CategorySelectOption {
    label: string;
    value: string;
}

export interface CategoriesSelectResult {
    isFetched?: boolean;
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
            const res = await api.get<undefined, Categorys>(
                "/product/category/",
                { query: full },
            );

            const success = unwrap(res);

            return {
                items: success.data,
                nextPage: success.meta?.next ?? null,
            };
        },
        getNextPageParam: (last) => last.nextPage,
        select: (data) => data.pages.flatMap((p) => p.items),
    });

    return {
        isFetched: query.isFetched,
        options:
            query.data?.map((c) => ({ label: c.name, value: c.slug })) ?? [],
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