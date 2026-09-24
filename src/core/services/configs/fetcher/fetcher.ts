import { type $Fetch } from 'ofetch';

import {
    type BackendErrorCode,
    ERROR_MESSAGES,
} from '@/core/constants/status-messages';

import {
    type AdapterOutput,
    type ResponseAdapter,
    identityAdapter,
} from './adapters';
import {
    type FetcherOptions,
    type RequestBody,
    type RequestOptions,
} from './fetcher.types';
import { isFetchError, isPlainData } from './helper';
import {
    type ApiFailure,
    type ApiError,
    type ApiResult,
    type ApiSuccess,
} from './types/client.types';
import { type ErrorEnvelope } from './types/contract.types';

const isErrorEnvelope = (v: unknown): v is ErrorEnvelope =>
    isPlainData(v) &&
    !Array.isArray(v) &&
    'error' in v &&
    isPlainData(v.error);

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

export interface AdapterOptions<TRaw, TData> {
    adapter?: ResponseAdapter<TRaw, TData>;
}

export function createApi({ client }: { client: $Fetch }) {
    async function request<
        TRaw,
        TData = TRaw,
        TBody extends RequestBody = RequestBody,
    >(
        url: string,
        options: FetcherOptions<TBody> & AdapterOptions<TRaw, TData> = {},
    ): Promise<ApiResult<TData>> {
        const { adapter, ...fetchOptions } = options;

        try {
            const response = await client.raw<TRaw>(url, fetchOptions);
            const rawData = (response._data ?? null) as TRaw;

            const adapted: AdapterOutput<TData> = adapter
                ? adapter(rawData)
                : identityAdapter(rawData as unknown as TData);

            const res: ApiSuccess<TData> = {
                ok: true,
                status: response.status,
                statusText: response.statusText,
                data: adapted.data,
                ...(adapted.meta ? { meta: adapted.meta } : {}),
            };

            if (process.env.NODE_ENV === 'development') {
                console.warn('[api:success]', res);
            }

            return res;
        } catch (error) {
            const failure = isFetchError(error) ? error : null;
            const status = failure?.status ?? failure?.response?.status ?? 0;
            const statusText =
                failure?.statusText ?? failure?.response?.statusText ?? '';

            const res: ApiFailure = {
                ok: false,
                status,
                statusText,
                error: toError(status, failure?.data, error),
            };

            if (process.env.NODE_ENV === 'development') {
                console.error('[api:error]', { ...res, raw: res.error.raw });
            }

            return res;
        }
    }

    return {
        get: <TRaw, TData = TRaw>(
            url: string,
            options?: RequestOptions & AdapterOptions<TRaw, TData>,
        ) => request<TRaw, TData>(url, { ...options, method: 'GET' }),

        post: <TRaw, TData = TRaw, TBody extends RequestBody = RequestBody>(
            url: string,
            body?: TBody,
            options?: RequestOptions & AdapterOptions<TRaw, TData>,
        ) => request<TRaw, TData, TBody>(url, { ...options, method: 'POST', body }),

        put: <TRaw, TData = TRaw, TBody extends RequestBody = RequestBody>(
            url: string,
            body?: TBody,
            options?: RequestOptions & AdapterOptions<TRaw, TData>,
        ) => request<TRaw, TData, TBody>(url, { ...options, method: 'PUT', body }),

        patch: <TRaw, TData = TRaw, TBody extends RequestBody = RequestBody>(
            url: string,
            body?: TBody,
            options?: RequestOptions & AdapterOptions<TRaw, TData>,
        ) => request<TRaw, TData, TBody>(url, { ...options, method: 'PATCH', body }),

        delete: <TRaw, TData = TRaw, TBody extends RequestBody = RequestBody>(
            url: string,
            body?: TBody,
            options?: RequestOptions & AdapterOptions<TRaw, TData>,
        ) => request<TRaw, TData, TBody>(url, { ...options, method: 'DELETE', body }),
    };
}