import { isPlainData } from './helper';
import { type PaginationMeta } from './types/client.types';

export interface AdapterOutput<T> {
    data: T;
    meta?: PaginationMeta;
}
export interface Paginated<T> {
    count: number;
    page: number;
    pageSize: number;
    totalPages: number;
    results: T[];
}
export type ResponseAdapter<TRaw, TData> = (raw: TRaw) => AdapterOutput<TData>;


/* -------------------------------------------------------------------------- */
/*                              Shape detection                               */
/* -------------------------------------------------------------------------- */

function isPaginated(v: unknown): v is Paginated<unknown> {
    return (
        isPlainData(v) &&
        !Array.isArray(v) &&
        typeof (v as { count?: unknown }).count === 'number' &&
        typeof (v as { page?: unknown }).page === 'number' &&
        typeof (v as { totalPages?: unknown }).totalPages === 'number' &&
        Array.isArray((v as { results?: unknown }).results)
    );
}

/* -------------------------------------------------------------------------- */
/*                            contractToClient                                */
/* -------------------------------------------------------------------------- */

export type DefaultAdapter<TRaw = unknown, TData = unknown> = (
    raw: TRaw,
    query: unknown,
) => AdapterOutput<TData>;

/**
 * Default response transformer.
 * Unwraps `Paginated<T>` to `{ data: T[], meta }`.
 * Anything else passes through unchanged.
 */
export const contractToClient: DefaultAdapter = (raw) => {
    const payload = Array.isArray(raw) && raw.length === 1 ? raw[0] : raw;

    if (isPaginated(payload)) {
        const meta: PaginationMeta = {
            current: payload.page,
            next: payload.page < payload.totalPages ? payload.page + 1 : null,
            previous: payload.page > 1 ? payload.page - 1 : null,
            totalPages: payload.totalPages,
            rowCount: payload.count,
            size: payload.pageSize,
        };

        return { data: payload.results as never, meta };
    }

    return { data: payload as never };
};