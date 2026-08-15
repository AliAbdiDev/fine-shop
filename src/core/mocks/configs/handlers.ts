import { fromOpenApi } from '@mswjs/source/open-api'
import { http, HttpResponse, type RequestHandler } from 'msw'

import schema from '../schema.json'

export const BASE = (
    process.env.NEXT_PUBLIC_API_BASE_URL!
).replace(/\/$/, '')

/**
 * Manual handlers. Kept FIRST so they win over schema-generated ones
 * (MSW resolves the first matching handler).
 */
const overrides: RequestHandler[] = [
    /**
     * Diagnostic probe. Exists ONLY when MSW is active, so a 200 here
     * is hard proof that requests are being intercepted.
     */
    http.get(`${BASE}/__msw/ping`, () =>
        HttpResponse.json({ mocking: true, base: BASE, at: new Date().toISOString() }),
    ),
]

let cache: RequestHandler[] | null = null

export async function getHandlers(): Promise<RequestHandler[]> {
    if (!cache) {
        cache = [...overrides, ...(await fromOpenApi(schema as never))]
    }
    return cache
}
