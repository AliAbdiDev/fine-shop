"use cache";

import { cacheLife, cacheTag } from "next/cache";

import { type Categorys } from "@/core/types/entities.types";

import { categorieKey } from "./misc-utils";
import { api } from "../configs/api";

const PAGE_SIZE = 100;

function fetchPage(page: number) {
    return api.get<undefined, Categorys>("/product/category/", {
        query: { page, pageSize: PAGE_SIZE },
    });
}

export async function getAllCategories() {
    try {
        cacheTag(categorieKey);
        cacheLife("max");

        const first = await fetchPage(1);
        if (!first.ok || !first.data) return { ok: false, data: [] } as const;

        const totalPages = first.meta?.totalPages ?? 1;

        if (totalPages <= 1) return first;

        const rest = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 2)),
        );

        const failed = rest.find((r) => !r.ok);
        if (failed && !failed.ok) return { ok: false, data: [] } as const;

        const results = [
            ...first.data,
            ...rest.flatMap((r) => (r.ok && r.data ? r.data : [])),
        ];

        return {
            ok: true,
            status: first.status,
            statusText: first.statusText,
            data: results,
        };
    } catch {
        return { ok: false, data: [] } as const;
    }
}
