import { cache } from 'react';

import {
    MutationCache,
    QueryCache,
    QueryClient,
    environmentManager,
} from '@tanstack/react-query';

import { notify } from '@/core/components/custom/notify';

const makeQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60_000,
                gcTime: 5 * 60_000,
                retry: 1,
                refetchOnWindowFocus: false,
            },
        },

        queryCache: new QueryCache({
            onError: (error, query) => {
                console.log("🚀 ~ makeQueryClient ~ error:", error)
                const custom = query.meta?.toastMessage?.(error);
                if (typeof custom === 'string') {
                    notify.error(custom);
                    return;
                }
                notify.error(error);
            },
        }),

        mutationCache: new MutationCache({
            onSuccess: (_data, _vars, _ctx, mutation) => {
                const s = mutation.meta?.successToast;

                if (s === false) return; // mute
                if (typeof s === 'string') {
                    notify.success(s);
                    return;
                }
                if (typeof s === 'function') {
                    const msg = s(_data);
                    if (typeof msg === 'string') notify.success(msg);
                    return;
                }
                notify.success();
            },

            onError: (error, _v, _c, mutation) => {
                if (mutation.meta?.muteErrorToast) return;

                const custom = mutation.meta?.toastMessage?.(error);
                if (typeof custom === 'string') {
                    notify.error(custom);
                    return;
                }
                notify.error(error);
            },
        }),
    });

const getServerQueryClient = cache(makeQueryClient);
let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
    if (environmentManager.isServer()) return getServerQueryClient();
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
};