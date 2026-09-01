import { createFetch } from 'ofetch';

import { transformKeys } from '@/core/utils/helpers';

import { createApi } from './fetcher/fetcher';
import { shouldTransform, isPlainData } from './fetcher/helper';
// ---------- Transport config: baseURL, key transform, retry policy, revalidate ----------
const clientConfig = createFetch({
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        globalThis.fetch(input, init),
}).create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api',
    retryDelay: 500,
    timeout: 25_000,
    // 429 is excluded on purpose: retry_after lives in `details`, the call site decides.
    retryStatusCodes: [408, 425, 500, 502, 503, 504],

    onRequest({ options }) {
        // retry is opted-in per method. A global retry would also repeat non-idempotent
        // calls (POST/PUT/PATCH/DELETE) and duplicate side effects on a lost response.
        const idempotent =
            !options.method || /^(GET|HEAD|OPTIONS)$/i.test(options.method);
        if (options.retry === undefined) options.retry = idempotent ? 1 : false;

        if (shouldTransform(options)) {
            if (isPlainData(options.body)) {
                options.body = transformKeys(options.body, 'snake');
            }
            if (isPlainData(options.query)) {
                options.query = transformKeys(options.query, 'snake');
            }
        }

        if (options.next) options.next = { revalidate: 60, ...options.next };
    },

    // Only successful bodies are camelized. Error bodies stay raw so `details`
    // reaches the call site with the backend's original keys (`retry_after`).
    onResponse({ response, options }) {
        if (response.ok && shouldTransform(options) && isPlainData(response._data)) {
            response._data = transformKeys(response._data, 'camel');
        }
    },

});

export const api = createApi({ client: clientConfig });
