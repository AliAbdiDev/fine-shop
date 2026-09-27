import { createFetch } from 'ofetch';

import { transformKeys } from '@/core/utils/helpers';

import { createApi } from './fetcher/fetcher';
import { shouldTransform, isPlainData } from './fetcher/helper';

const clientConfig = createFetch({
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        globalThis.fetch(input, init),
}).create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api',
    retryDelay: 500,
    timeout: 25_000,
    retryStatusCodes: [408, 425, 500, 502, 503, 504],

    onRequest({ options }) {
        const idempotent =
            !options.method || /^(GET|HEAD|OPTIONS)$/i.test(options.method);
        if (options.retry === undefined) options.retry = idempotent ? 1 : false;

        if (shouldTransform(options)) {
            const body = options.body;
            if (
                isPlainData(body) ||
                body instanceof FormData ||
                body instanceof URLSearchParams
            ) {
                options.body = transformKeys(body, 'snake');
            }

            if (isPlainData(options.query)) {
                options.query = transformKeys(options.query, 'snake');
            }
        }

        if (options.next) options.next = { revalidate: 60, ...options.next };
    },

    onResponse({ response, options }) {
        if (response.ok && shouldTransform(options) && isPlainData(response._data)) {
            response._data = transformKeys(response._data, 'camel');
        }
    },
});

export const api = createApi({ client: clientConfig });