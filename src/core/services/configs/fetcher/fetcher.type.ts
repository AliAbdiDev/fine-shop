import { type FetchOptions } from 'ofetch';

import { type ERROR_MESSAGES, type INTERNAL_ERROR_CODES } from './constant';

export type InternalErrorCode = (typeof INTERNAL_ERROR_CODES)[number];
export type ErrorMessagesKeys = keyof typeof ERROR_MESSAGES
export type BackendErrorCode = Exclude<ErrorMessagesKeys, InternalErrorCode>;
export type AppErrorCode = BackendErrorCode | InternalErrorCode;

// ----
export interface TransformOptions {
    skipTransform?: boolean;
}

export interface PaginationMeta {
    page: number;
    perPage: number;
    total: number;
}
export interface SuccessEnvelope<T = undefined> {
    message: string;
    data?: T;
    meta?: PaginationMeta;
    token?: string
}
export interface ErrorEnvelope {
    error: {
        code: AppErrorCode;
        message: string | null;
        details: string | null;
    };
}

export interface ApiError {
    code: AppErrorCode | null;
    status: number;
    message: string | null;
    details: string | null;
    raw: unknown;
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
    error: ApiError;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export type FetcherOptions = FetchOptions<'json'> & TransformOptions;
export type RequestOptions = Omit<FetcherOptions, 'method' | 'body'>;
export type RequestBody = FetchOptions['body'];

