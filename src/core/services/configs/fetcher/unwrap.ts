import {
    type ApiSuccess,
    type ApiError,
    type ApiResult,
} from './types/client.types';

export function createApiError(apiError: ApiError): ApiError {
    const err = new Error(
        apiError.message ?? `Request failed with status ${apiError.status}`,
    ) as unknown as ApiError & { name: string };

    err.name = 'ApiClientError';
    err.code = apiError.code;
    err.status = apiError.status;
    err.details = apiError.details;
    err.raw = apiError.raw;

    return err;
}

export function unwrap<T>(res: ApiResult<T>): ApiSuccess<T> {
    if (!res.ok) {
        throw createApiError(res.error);
    }
    return res;
}