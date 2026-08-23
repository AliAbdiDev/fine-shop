import { cache } from 'react';

import { MutationCache, QueryCache, QueryClient, environmentManager } from '@tanstack/react-query';

import { notify } from '@/core/components/custom/notify';

const makeQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60_000,
                gcTime: 5 * 60_000,
                retry: 0,
                refetchOnWindowFocus: false,
            },
        },
        queryCache: new QueryCache({
            onError: (error) => notify.error(error),
        }),
        mutationCache: new MutationCache({
            onError: (error) => notify.error(error),
        }),
    });

const getServerQueryClient = cache(makeQueryClient);
let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
    if (environmentManager.isServer()) return getServerQueryClient();
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
};