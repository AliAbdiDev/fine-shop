import { type AppErrorCode } from "../constant";

export interface PaginationMeta {
    page: number;
    perPage: number;
    total: number;
}

export interface SuccessEnvelope<T = undefined> {
    message: string;
    data?: T;
    meta?: PaginationMeta;
    token?: string;
}

export interface ErrorEnvelope {
    error: {
        code: AppErrorCode;
        message: string | null;
        details: string | null;
    };
}