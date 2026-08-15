import { type FetchOptions } from "ofetch";

export interface TransformOptions {
    skipTransform?: boolean;
}

// ---------- Error contract ----------

/** Backend error envelope: { error: { code, message, details } } */
export interface ApiErrorResponse {
    error: {
        code: string | null;
        message: string | null;
        details: Record<string, unknown> | null;
    };
}

export type ErrorKind =
    | 'network'
    | 'auth'
    | 'forbidden'
    | 'notFound'
    | 'validation'
    | 'rateLimit'
    | 'server'
    | 'unknown';

export interface AppError {
    kind: ErrorKind;
    /** 0 means the request never got a response (network / timeout / abort). */
    status: number;
    code: string | null;
    /**
     * Backend payload, kept in the backend's own casing. Read it where it matters
     * (field errors on a form, `retry_after` on the login screen) — it is deliberately
     * not flattened into named fields here, since each one would only serve one caller.
     */
    details: Record<string, unknown> | null;
    /** Dev only; raw backend body for debugging. Always null in production. */
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
    data: null;
    error: AppError;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export type FetcherOptions = FetchOptions<'json'> & TransformOptions;
export type RequestOptions = Omit<FetcherOptions, 'method' | 'body'>;
export type RequestBody = FetchOptions['body'];

export const isAppError = (e: unknown): e is AppError =>
    typeof e === 'object' && e !== null && 'kind' in e && 'status' in e;

/** What the transport knows about a failed call. */
export interface Failure {
    /** 0 when no response arrived at all: network, timeout, abort, CORS. */
    status: number;
    /** Parsed body, a string for non-JSON responses, or undefined. */
    body: unknown;
    /** The original thrown value. Only useful when `status` is 0. */
    cause: unknown;
}

/** Everything the transport does not get to decide. */
export interface ApiContract {
    baseURL: string;
    timeout?: number;
    retryDelay?: number;
    retryStatusCodes?: number[];

    /** Runs before the request leaves. Key casing, cache directives. */
    prepare?: (options: FetcherOptions) => void;

    /** Runs on successful bodies only. Error bodies must stay raw. */
    receive?: (data: unknown, options: FetcherOptions) => unknown;

    /** The single place the backend's error shape is read. */
    describe: (failure: Failure) => AppError;
}
