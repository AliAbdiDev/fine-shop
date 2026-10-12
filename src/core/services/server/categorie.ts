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
    cacheTag(categorieKey);
    cacheLife("weeks");

    const first = await fetchPage(1);
    if (!first.ok) return first;

    const totalPages = first.meta?.totalPages ?? 1;

    if (totalPages <= 1) return first;

    const rest = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 2)),
    );

    const failed = rest.find((r) => !r.ok);
    if (failed && !failed.ok) return failed;

    const results = [
        ...first.data,
        ...rest.flatMap((r) => (r.ok ? r.data : [])),
    ];

    return {
        ok: true,
        status: first.status,
        statusText: first.statusText,
        data: { ...first.data, results },
    };
}