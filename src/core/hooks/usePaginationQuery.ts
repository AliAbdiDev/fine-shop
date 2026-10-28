import * as React from 'react';

import { type Route } from 'next';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export interface PaginationQuery {
    page: number;
    size: number;
}

export interface UsePaginationQueryOptions {
    defaultPage?: number;
    defaultSize?: number;
    maxSize?: number;
    resetDeps?: React.DependencyList;
}

export function usePaginationQuery(options: UsePaginationQueryOptions = {}) {
    const {
        defaultPage = 1,
        defaultSize = 10,
        maxSize = 100,
        resetDeps = [],
    } = options;

    const router = useRouter();
    const pathname = usePathname();  // ← بدون cast
    const searchParams = useSearchParams();

    const page = React.useMemo(() => {
        const raw = Number(searchParams.get('page'));
        return Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : defaultPage;
    }, [searchParams, defaultPage]);

    const size = React.useMemo(() => {
        const raw = Number(searchParams.get('size'));
        if (!Number.isFinite(raw) || raw < 1) return defaultSize;
        return Math.min(Math.floor(raw), maxSize);
    }, [searchParams, defaultSize, maxSize]);

    const setPagination = React.useCallback(
        (next: Partial<PaginationQuery>) => {
            const params = new URLSearchParams(searchParams.toString());

            if (next.page !== undefined) params.set('page', String(next.page));
            if (next.size !== undefined) params.set('size', String(next.size));

            if (params.get('page') === String(defaultPage)) params.delete('page');
            if (params.get('size') === String(defaultSize)) params.delete('size');

            const query = params.toString();
            const url = query ? `${pathname}?${query}` : pathname;
            router.replace(url as Route, { scroll: false });
        },
        [router, pathname, searchParams, defaultPage, defaultSize],
    );

    React.useEffect(() => {
        if (resetDeps.length === 0) return;
        const params = new URLSearchParams(searchParams.toString());
        if (params.get('page') !== String(defaultPage)) {
            setPagination({ page: defaultPage });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, resetDeps);

    return { page, size, setPagination };
}