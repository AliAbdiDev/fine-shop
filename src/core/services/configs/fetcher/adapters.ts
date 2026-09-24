import { isPlainData } from './helper';
import { type PaginationMeta } from './types/client.types';

export interface AdapterOutput<T> {
    data: T;
    meta?: PaginationMeta;
}

export type ResponseAdapter<TRaw, TData> = (raw: TRaw) => AdapterOutput<TData>;

export const identityAdapter = <T>(raw: T): AdapterOutput<T> => ({ data: raw });

// ---------- DRF Paginated ----------

interface PaginatedShape<TItem> {
    count: number;
    next: string | null;
    previous: string | null;
    results: TItem[];
}

function isPaginatedShape<TItem>(v: unknown): v is PaginatedShape<TItem> {
    return (
        isPlainData(v) &&
        !Array.isArray(v) &&
        typeof (v as { count?: unknown }).count === 'number' &&
        Array.isArray((v as { results?: unknown }).results)
    );
}

/**
 * مقادیر پیجینیشن DRF را مستقیم روی PaginationMeta فرانت می‌نشاند.
 *
 * @param page     شماره‌ی صفحه‌ی فعلی (از ورودی کاربر — DRF نمی‌دهد)
 * @param pageSize اندازه‌ی صفحه (از ورودی کاربر)
 */
export function paginatedAdapter<TRaw, TItem>(
    page: number,
    pageSize: number,
): ResponseAdapter<TRaw, TItem[]> {
    return (raw) => {
        const payload = Array.isArray(raw) ? raw[0] : raw;

        if (!isPaginatedShape<TItem>(payload)) {
            return { data: (payload as unknown as TItem[]) ?? [] };
        }

        const totalPages =
            pageSize > 0 ? Math.ceil(payload.count / pageSize) : null;

        const meta: PaginationMeta = {
            current: page,
            next: payload.next !== null ? page + 1 : null,
            previous: payload.previous !== null ? page - 1 : null,
            totalPages,
            size: pageSize,
        };

        return {
            data: payload.results,
            meta,
        };
    };
}