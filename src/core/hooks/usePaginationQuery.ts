import * as React from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export interface PaginationQuery {
    page: number;
    size: number;
}

export interface UsePaginationQueryOptions {
    defaultPage?: number;
    defaultSize?: number;
    maxSize?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resetDeps?: any[]; // 👈 اضافه شدن آرایه وابستگی‌ها
}

export function usePaginationQuery(options: UsePaginationQueryOptions = {}) {
    const { defaultPage = 1, defaultSize = 10, maxSize = 100, resetDeps = [] } = options;

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const prevDeps = React.useRef(resetDeps);
    const depsChanged = React.useMemo(() => {
        if (resetDeps.length === 0) return false;
        // eslint-disable-next-line react-hooks/refs
        return !resetDeps.every((dep, i) => Object.is(dep, prevDeps.current[i]));
    }, [resetDeps]);

    const urlPage = React.useMemo(() => {
        const raw = Number(searchParams.get('page'));
        return Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : defaultPage;
    }, [searchParams, defaultPage]);

    const size = React.useMemo(() => {
        const raw = Number(searchParams.get('size'));
        if (!Number.isFinite(raw) || raw < 1) return defaultSize;
        return Math.min(Math.floor(raw), maxSize);
    }, [searchParams, defaultSize, maxSize]);

    const page = depsChanged ? 1 : urlPage;

    const setPagination = React.useCallback(
        (next: Partial<PaginationQuery>) => {
            const params = new URLSearchParams(searchParams.toString());

            if (next.page !== undefined) params.set('page', String(next.page));
            if (next.size !== undefined) params.set('size', String(next.size));

            if (params.get('page') === String(defaultPage)) params.delete('page');
            if (params.get('size') === String(defaultSize)) params.delete('size');

            const query = params.toString();
            router.replace(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
            });
        },
        [router, pathname, searchParams, defaultPage, defaultSize],
    );

    React.useEffect(() => {
        if (depsChanged) {
            prevDeps.current = resetDeps;
            if (urlPage !== 1) setPagination({ page: 1 });
        }
    }, [depsChanged, resetDeps, urlPage, setPagination]);

    return { page, size, setPagination };
}