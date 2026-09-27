import { isNullOrUndefined } from '@sindresorhus/is';

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
    { page, pageSize }: {
        page?: number,
        pageSize?: number,
    }
): ResponseAdapter<TRaw, TItem[]> {
    return (raw) => {
        if (isNullOrUndefined(page) || isNullOrUndefined(pageSize)) return { data: [] };

        // برخی endpointها پاسخ را داخل یک آرایه‌ی تک‌عضوی می‌پیچند.
        const payload = Array.isArray(raw) ? raw[0] : raw;

        if (!isPaginatedShape<TItem>(payload)) {
            // پاسخ DRF-paginated نیست؛ فرض می‌کنیم خودِ payload لیست است.
            return { data: (payload as unknown as TItem[]) ?? [] };
        }

        const hasNext = payload.next !== null;
        const hasPrevious = payload.previous !== null;
        const totalPages = pageSize > 0 ? Math.ceil(payload.count / pageSize) : null;

        const meta: PaginationMeta = {
            current: page,
            next: hasNext ? page + 1 : null,
            previous: hasPrevious ? page - 1 : null,
            totalPages,
            rowCount: payload.count,
            size: pageSize,
        };

        return {
            data: payload.results,
            meta,
        };
    };
}