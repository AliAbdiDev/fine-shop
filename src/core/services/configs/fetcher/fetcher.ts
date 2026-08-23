import { type $Fetch } from 'ofetch';

import { ERROR_MESSAGES } from './constant';
import {
    type BackendErrorCode,
    type ApiError,
    type ApiResult,
    type ErrorEnvelope,
    type FetcherOptions,
    type RequestBody,
    type RequestOptions,
} from './fetcher.type';
import { isFetchError, isPlainData } from './helper';


const isErrorEnvelope = (v: unknown): v is ErrorEnvelope =>
    isPlainData(v) && !Array.isArray(v) &&
    'error' in v && isPlainData(v.error);

const isBackendCode = (v: unknown): v is BackendErrorCode =>
    typeof v === 'string' && v in ERROR_MESSAGES;

function toError(status: number, body: unknown, raw: unknown): ApiError {
    const envelope = isErrorEnvelope(body) ? body.error : null;

    return {
        code: isBackendCode(envelope?.code) ? envelope?.code : null,
        message: envelope?.message ?? null,
        status,
        details: envelope?.details ?? null,
        raw: body ?? String(raw),
    };
}

export function createApi({
    client,
}: { client: $Fetch; }) {

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
            const failure = isFetchError(error) ? error : null;
            const status = failure?.status ?? failure?.response?.status ?? 0;
            const statusText =
                failure?.statusText ?? failure?.response?.statusText ?? '';

            return {
                ok: false,
                status,
                statusText,
                error: toError(status, failure?.data, error),
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
