// core/query-client/get-query-client.ts
import { cache } from 'react';

import { QueryClient } from '@tanstack/react-query';

// تابع سازنده که هم در سرور و هم در کلاینت قابل استفاده است
export const makeQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60_000,
                gcTime: 5 * 60_000,
                retry: 1,
                refetchOnWindowFocus: false,

            },
        },
    });

// نسخهٔ مموایز شده برای سرور
export const getQueryClient = cache(makeQueryClient);