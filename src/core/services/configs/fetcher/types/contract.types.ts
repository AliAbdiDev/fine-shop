import { type AppErrorCode } from "@/core/constants/status-messages";

export interface SuccessEnvelope<T = undefined> {
    message: string;
    data?: T;
    token?: string;
}

export interface ErrorEnvelope {
    error: {
        code: AppErrorCode;
        message: string | null;
        details: string | null;
    };
}

export interface DrfPaginated<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}