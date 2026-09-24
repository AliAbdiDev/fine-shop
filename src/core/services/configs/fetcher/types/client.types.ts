import { type AppErrorCode } from '@/core/constants/status-messages';

export interface PaginationMeta {
    current: number | null;
    next: number | null;
    previous: number | null;
    totalPages: number | null;
    size: number | null;

}

export interface ApiSuccess<T> {
    ok: true;
    status: number;
    statusText: string;
    data: T;
    meta?: PaginationMeta;
}

export interface ApiError {
    code: AppErrorCode | null;
    status: number;
    message: string | null;
    details: string | null;
    raw: unknown;
}

export interface ApiFailure {
    ok: false;
    status: number;
    statusText: string;
    error: ApiError;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;