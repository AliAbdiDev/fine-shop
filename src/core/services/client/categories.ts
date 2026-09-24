import * as React from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { categoryKeys } from "./keys";
import { api } from "../configs/api";

/* -------------------- domain -------------------- */

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface CategoryPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: Category[];
}

/* -------------------- hook options -------------------- */

export interface CategoriesQueryParams {
    page_size?: number;
    search?: string;
    enabled?: boolean;
}

/* -------------------- hook return -------------------- */

/** شکلی که این سرویس برای سلکت‌باکس‌ها فراهم می‌کند */
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

export function useCategoriesInfiniteSelect(
    params: CategoriesQueryParams = {},
): CategoriesSelectResult {
    const { page_size = 20, search, enabled = true } = params;

    const query = useInfiniteQuery({
        queryKey: categoryKeys.list({ page_size, search }),
        enabled,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const res = await api.get<CategoryPage>("/product/category/", {
                query: { page: pageParam, page_size, search },
            });

            if (!res.ok) {
                return { items: [] as Category[], nextPage: null };
            }

            return {
                items: res.data.results,
                nextPage: res.data.next ? pageParam + 1 : null,
            };
        },
        getNextPageParam: (last) => last.nextPage,
    });

    const options = React.useMemo<CategorySelectOption[]>(
        () =>
            query.data?.pages.flatMap((page) =>
                page.items.map((c) => ({ label: c.name, value: c.slug })),
            ) ?? [],
        [query.data],
    );

    const onLoadMore = React.useCallback(() => {
        if (!query.hasNextPage || query.isFetchingNextPage) return;
        void query.fetchNextPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

    return {
        options,
        isLoading: query.isLoading,
        isFetchingNextPage: query.isFetchingNextPage,
        hasNextPage: query.hasNextPage,
        onLoadMore,
    };
}