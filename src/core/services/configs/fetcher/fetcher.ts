import { type $Fetch } from 'ofetch';

import { type ApiResult, type AppError, type FetcherOptions, type RequestBody, type RequestOptions } from './fetcher.type';
import { isFetchError } from './helper';

// Everything the error mapper needs, already pulled out of the transport layer.
// `body` is the parsed error body when a response arrived; `raw` is the original throw.
export interface RequestFailure {
    status: number;
    statusText: string;
    body: unknown;
    raw: unknown;
}

export interface ApiDeps {
    client: $Fetch;
    toAppError: (failure: RequestFailure) => AppError;
}

// Pure transport. Knows how to issue a request, shape the ApiResult, and read a
// FetchError — nothing about this backend's envelope, keys, retry policy or env.
export function createApi({ client, toAppError }: ApiDeps) {
    async function request<T>(
        url: string,
        options: FetcherOptions = {},
    ): Promise<ApiResult<T>> {
        try {
            const response = await client.raw<T>(url, options);

            return {
                ok: true,
                status: response.status,
                statusText: response.statusText,
                data: response._data ?? (null as T),
                error: null,
            };
        } catch (error) {
            // No FetchError means no response at all: network failure, timeout or abort.
            const failure = isFetchError(error) ? error : null;
            const status = failure?.status ?? failure?.response?.status ?? 0;
            const statusText =
                failure?.statusText ?? failure?.response?.statusText ?? '';

            return {
                ok: false,
                status,
                statusText,
                data: null,
                error: toAppError({ status, statusText, body: failure?.data, raw: error }),
            };
        }
    }

    return {
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
}

export function unwrap<T>(res: ApiResult<T>): T {
    if (res.ok) return res.data;
    throw res.error;
}
