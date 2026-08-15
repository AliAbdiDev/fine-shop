import { createFetch, type FetchError, type FetchOptions } from 'ofetch';

import { transformKeys } from '@/core/utils/helpers';

export interface TransformOptions {
    skipTransform?: boolean;
}

export interface ApiErrorResponse {
    code?: string;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface ApiSuccess<T> {
    ok: true;
    status: number;
    statusText: string;
    data: T;
    error: null;
}

export interface ApiFailure {
    ok: false;
    status: number;
    statusText: string;
    data: ApiErrorResponse | null;
    error: FetchError<ApiErrorResponse> | Error;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export type FetcherOptions = FetchOptions<'json'> & TransformOptions;
export type RequestOptions = Omit<FetcherOptions, 'method' | 'body'>;
export type RequestBody = FetchOptions['body'];

const isPlainData = (v: unknown): v is Record<string, unknown> | unknown[] =>
    !!v &&
    typeof v === 'object' &&
    (Array.isArray(v) ||
        Object.getPrototypeOf(v) === Object.prototype ||
        Object.getPrototypeOf(v) === null);

const isFetchError = (e: unknown): e is FetchError<ApiErrorResponse> =>
    e instanceof Error && 'response' in e;

/** `skipTransform` isn't part of ofetch's option type, so it's read via a narrow cast. */
const shouldTransform = (options: object): boolean =>
    !('skipTransform' in options && options.skipTransform === true);

const $fetch = createFetch({
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        globalThis.fetch(input, init),
});

export const createFetcher = () =>
    $fetch.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api',
        retryDelay: 500,
        timeout: 25_000,

        onRequest({ options }) {
            console.log('base url', process.env.NEXT_PUBLIC_API_BASE_URL);
            // DECISION: retry is opted-in per method instead of globally in `create`.
            // A global `retry: 1` would also retry non-idempotent calls (POST/PUT/PATCH/DELETE).
            // If the server already applied the change but the response was lost (timeout /
            // flaky network), a retry duplicates the side effect — e.g. two orders, two payments.
            // So only idempotent methods get a retry by default; the rest opt in explicitly
            // (e.g. `api.post(url, body, { retry: 2 })` when the endpoint has an idempotency key).
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

        onResponse({ response, options }) {
            if (shouldTransform(options) && isPlainData(response._data)) {
                response._data = transformKeys(response._data, 'camel');
            }
        },
    });

const fetcher = createFetcher();

async function request<T>(
    url: string,
    options: FetcherOptions = {},
): Promise<ApiResult<T>> {
    try {
        const response = await fetcher.raw<T>(url, options);

        return {
            ok: true,
            status: response.status,
            statusText: response.statusText,
            data: response._data ?? (null as T),
            error: null,
        };
    } catch (error) {
        if (isFetchError(error)) {
            return {
                ok: false,
                status: error.status ?? error.response?.status ?? 0,
                statusText: error.statusText ?? error.response?.statusText ?? '',
                data: isPlainData(error.data) ? (error.data as ApiErrorResponse) : null,
                error,
            };
        }

        return {
            ok: false,
            status: 0,
            statusText: '',
            data: null,
            error: error instanceof Error ? error : new Error(String(error)),
        };
    }
}

export const api = {
    get: <T>(url: string, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'GET' }),

    post: <T>(url: string, body?: RequestBody, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'POST', body }),

    put: <T>(url: string, body?: RequestBody, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'PUT', body }),

    patch: <T>(url: string, body?: RequestBody, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'PATCH', body }),

    delete: <T>(url: string, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'DELETE' }),
};
