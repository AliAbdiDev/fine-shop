import { type AppErrorCode } from '../constant';

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
