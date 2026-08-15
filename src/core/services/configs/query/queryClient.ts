import { cache } from 'react';

import { MutationCache, QueryCache, QueryClient, environmentManager } from '@tanstack/react-query';

import { toast } from '@/core/components/ui/toast';

import { isAppError } from '../fetcher/fetcher.type';

const notify = (title: string) => {
    if (environmentManager.isServer()) return;
    toast.add({ type: 'error', title });
};

const notifyFromError = (error: unknown, fallback: string) => {
    if (!isAppError(error)) return;
    if (error.kind === 'auth') return;
    if (error.kind === 'network')
        return notify('خطا در برقراری ارتباط. لطفاً اینترنت خود را بررسی کنید.');
    if (error.kind === 'server') return notify(fallback);
};

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
            onError: (error) => notifyFromError(error, 'خطای سرور، بعداً تلاش کنید'),
        }),
        mutationCache: new MutationCache({
            onError: (error) => notifyFromError(error, 'عملیات ناموفق بود'),
        }),
    });


const getServerQueryClient = cache(makeQueryClient);

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
    if (environmentManager.isServer()) return getServerQueryClient();
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
};