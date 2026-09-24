import {
    type ApiError,
    type ApiResult,
    type ApiSuccess,
} from './types/client.types';

export function createApiError(apiError: ApiError): Error & { apiError: ApiError } {
    const err = new Error(
        apiError.message ?? `Request failed with status ${apiError.status}`,
    ) as Error & { apiError: ApiError };
    err.name = 'ApiClientError';
    err.apiError = apiError;
    return err;
}

export function unwrap<T>(res: ApiResult<T>): ApiSuccess<T> {
    if (!res.ok) throw createApiError(res.error);
    return res;
}