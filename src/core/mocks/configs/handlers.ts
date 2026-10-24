import { http, HttpResponse, type RequestHandler } from 'msw'

import { handleWithOpenApi } from './engine'

export const BASE = (
    process.env.NEXT_PUBLIC_API_BASE_URL!
).replace(/\/$/, '')

/**
 * Standard error envelope: `{ error: { code, message, details } }`.
 * Hard-coded here so the error layer (normalize/report) is testable
 * WITHOUT the backend documenting error responses. `details` is `null`
 * when absent — never omitted — matching the contract.
 */
function errorBody(code: string, message: string, details: unknown = null) {
    return { error: { code, message, details } }
}

/**
 * Manual handlers. Kept FIRST so they win over the schema catch-all
 * (MSW resolves the first matching handler). All error-injection routes
 * live under reserved `__` prefixes and can never collide with a real
 * documented path.
 */
const overrides: RequestHandler[] = [
    /**
     * Diagnostic probe. Exists ONLY when MSW is active, so a 200 here
     * is hard proof that requests are being intercepted.
     */
    http.get(`${BASE}/__msw/ping`, () =>
        HttpResponse.json({ mocking: true, base: BASE, at: new Date().toISOString() }),
    ),

    /**
     * 401 — missing / expired session. Drives the auth branch of
     * `normalizeError` and the redirect-to-login side effect.
     */
    http.all(`${BASE}/__test/401`, () =>
        HttpResponse.json(
            errorBody('unauthorized', 'Authentication credentials were not provided or are invalid.'),
            { status: 401 },
        ),
    ),

    /**
     * 429 — rate limited. `Retry-After` header proves the client reads it;
     * `details.retryAfter` mirrors it for UIs that only inspect the body.
     */
    http.all(`${BASE}/__test/429`, () => {
        const retryAfter = 30
        return HttpResponse.json(
            errorBody('rate_limited', 'Too many requests. Please slow down.', { retryAfter }),
            { status: 429, headers: { 'Retry-After': String(retryAfter) } },
        )
    }),

    /**
     * 422 — field-level validation errors. `details.fields` is the map the
     * form layer reads to render inline errors; the schema generator never
     * produces a realistic field-error payload, so this stays manual.
     */
    http.all(`${BASE}/__test/422`, () =>
        HttpResponse.json(
            errorBody('validation_error', 'The submitted data is invalid.', {
                fields: {
                    email: ['Enter a valid email address.'],
                    password: ['This field is too short.', 'This field is required.'],
                },
            }),
            { status: 422 },
        ),
    ),

    /**
     * 500 with a NON-JSON body — the adversarial case. A gateway returning
     * an HTML error page is exactly where naive `res.json()` throws.
     * `normalizeError` must survive an unparseable body and still yield a
     * stable AppError.
     */
    http.all(`${BASE}/__test/500`, () =>
        new HttpResponse(
            '<!doctype html><html><head><title>502 Bad Gateway</title></head>' +
            '<body><h1>502 Bad Gateway</h1><p>nginx</p></body></html>',
            { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
        ),
    ),

    /**
     * Network-level failure (no HTTP response at all). Exercises the
     * "fetch rejected / no response" branch of `normalizeError`.
     */
    http.all(`${BASE}/__test/network`, () => HttpResponse.error()),
]

let cache: RequestHandler[] | null = null

export async function getHandlers(): Promise<RequestHandler[]> {
    if (!cache) {
        /**
         * One catch-all instead of per-operation handlers: the engine reads
         * the OpenAPI document at runtime, so a new endpoint only needs to
         * appear in `schema.json` to become mockable.
         */
        cache = [
            ...overrides,
            http.all(`${BASE}/*`, ({ request }) => handleWithOpenApi(request)),
        ]
    }
    return cache
}
