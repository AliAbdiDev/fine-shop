import { type $Fetch } from 'ofetch';

import {
    type BackendErrorCode,
    ERROR_MESSAGES,
} from '@/core/constants/status-messages';

import {
    type AdapterOutput,
    type ResponseAdapter,
    type DefaultAdapter,
    contractToClient,
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

export interface AdapterOptions<TContract, TClient> {
    adapter?: ResponseAdapter<TContract, TClient>;
}

export interface AuthOptions {
    token?: string | null;
}

export function createApi({
    client,
    defaultAdapter = contractToClient,
}: {
    client: $Fetch;
    defaultAdapter?: DefaultAdapter;
}) {
    /**
     * @typeParam TContract - Shape of the raw response coming from the backend.
     * @typeParam TClient   - Shape the frontend consumes after the adapter runs.
     * @typeParam TBody     - Shape of the request body.
     */
    async function request<
        TContract,
        TClient = TContract,
        TBody extends RequestBody = RequestBody,
    >(
        url: string,
        options: FetcherOptions<TBody> &
            AdapterOptions<TContract, TClient> &
            AuthOptions = {},
    ): Promise<ApiResult<TClient>> {
        const { adapter, token, ...fetchOptions } = options;

        if (token) {
            const headers = new Headers(fetchOptions.headers);
            headers.set('Authorization', `Bearer ${token}`);
            fetchOptions.headers = headers;
        }

        try {
            const response = await client.raw<TContract>(url, fetchOptions);
            const rawData = (response._data ?? null) as TContract;

            const adapted: AdapterOutput<TClient> = adapter
                ? adapter(rawData)
                : (defaultAdapter(rawData, fetchOptions.query) as AdapterOutput<TClient>);

            const res: ApiSuccess<TClient> = {
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

    type Options<TContract, TClient> = RequestOptions &
        AdapterOptions<TContract, TClient> &
        AuthOptions;

    return {
        get: <TContract, TClient = TContract>(
            url: string,
            options?: Options<TContract, TClient>,
        ) => request<TContract, TClient>(url, { ...options, method: 'GET' }),

        post: <TContract, TClient = TContract, TBody extends RequestBody = RequestBody>(
            url: string,
            body?: TBody,
            options?: Options<TContract, TClient>,
        ) => request<TContract, TClient, TBody>(url, { ...options, method: 'POST', body }),

        put: <TContract, TClient = TContract, TBody extends RequestBody = RequestBody>(
            url: string,
            body?: TBody,
            options?: Options<TContract, TClient>,
        ) => request<TContract, TClient, TBody>(url, { ...options, method: 'PUT', body }),

        patch: <TContract, TClient = TContract, TBody extends RequestBody = RequestBody>(
            url: string,
            body?: TBody,
            options?: Options<TContract, TClient>,
        ) => request<TContract, TClient, TBody>(url, { ...options, method: 'PATCH', body }),

        delete: <TContract, TClient = TContract, TBody extends RequestBody = RequestBody>(
            url: string,
            options?: Options<TContract, TClient>,
            body?: TBody,
        ) => request<TContract, TClient, TBody>(url, { ...options, method: 'DELETE', body }),
    };
}