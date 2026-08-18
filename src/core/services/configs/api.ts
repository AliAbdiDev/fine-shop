import { createFetch } from 'ofetch';

import { APP_MODE } from '@/core/constants/misc';
import { transformKeys } from '@/core/utils/helpers';

import { createApi, type RequestFailure } from './fetcher/fetcher';
import { type AppError, type ErrorKind } from './fetcher/fetcher.type';
import {
    shouldTransform,
    isPlainData,
    asRecord,
} from './fetcher/helper';


// ---------- Transport config: baseURL, key transform, retry policy, revalidate ----------

const client = createFetch({
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        globalThis.fetch(input, init),
}).create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api',
    retryDelay: 500,
    timeout: 25_000,
    // 429 is excluded on purpose: retry_after lives in `details`, the call site decides.
    retryStatusCodes: [408, 425, 500, 502, 503, 504],

    onRequest({ options }) {
        // retry is opted-in per method. A global retry would also repeat non-idempotent
        // calls (POST/PUT/PATCH/DELETE) and duplicate side effects on a lost response.
        const idempotent =
            !options.method || /^(GET|HEAD|OPTIONS)$/i.test(options.method);
        if (options.retry === undefined) options.retry = idempotent ? 1 : false;

        if (shouldTransform(options)) {
            if (isPlainData(options.body)) {
                options.body = transformKeys(options.body, 'snake');
            }
            if (isPlainData(options.query)) {
                options.query = transformKeys(options.query, 'snake');
            }
        }

        if (options.next) options.next = { revalidate: 60, ...options.next };
    },

    // Only successful bodies are camelized. Error bodies stay raw so `details`
    // reaches the call site with the backend's original keys (`retry_after`).
    onResponse({ response, options }) {
        if (response.ok && shouldTransform(options) && isPlainData(response._data)) {
            response._data = transformKeys(response._data, 'camel');
        }
    },
});

// ---------- Contract: how this backend's error shape maps to AppError ----------

function toAppError({ status, body, raw }: RequestFailure): AppError {
    // Envelope: { error: { code, message, details } }. May be absent on a non-JSON 500.
    const envelope = asRecord(asRecord(body)?.error);

    let kind: ErrorKind = 'unknown';
    if (status === 0) kind = 'network';
    else if (status === 400 || status === 422) kind = 'validation';
    else if (status === 401) kind = 'auth';
    else if (status === 403) kind = 'forbidden';
    else if (status === 404) kind = 'notFound';
    else if (status === 429) kind = 'rateLimit';
    else if (status >= 500) kind = 'server';

    return {
        kind,
        status,
        code: typeof envelope?.code === 'string' ? envelope.code : null,
        details: asRecord(envelope?.details),
        // body when a response arrived (object / HTML string), else the thrown error.
        raw: APP_MODE.isDev ? (body ?? String(raw)) : null,
    };
}

export const api = createApi({ client, toAppError });
