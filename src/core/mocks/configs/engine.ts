import addFormats from 'ajv-formats'
import { HttpResponse } from 'msw'
import { type Context, type Document, OpenAPIBackend } from 'openapi-backend'

import schema from '../schema.json'

/** Methods that may carry a JSON request body. */
const BODY_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/**
 * The generated schema is plain JSON, so TypeScript widens its literal
 * fields (`type`, `in`, ...) to `string` and it no longer matches the
 * OpenAPI document type. The runtime shape is correct.
 */
const definition = schema as never as Document

const api = new OpenAPIBackend({
    definition,
    validate: true,
    ajvOpts: { strict: false },
    /**
     * Ajv 8 ships no format validators. Without these, `format: email`
     * (and date-time, uri, uuid...) are silently ignored and invalid
     * payloads would pass validation.
     */
    customizeAjv: (ajv) => {
        addFormats(ajv)
        return ajv
    },
})

api.register({
    validationFail: ({ validation }: Context) =>
        HttpResponse.json(
            { message: 'Request validation failed', errors: validation.errors ?? [] },
            { status: 400 },
        ),

    notFound: ({ request }: Context) =>
        HttpResponse.json(
            { message: `No operation documented for ${request.method.toUpperCase()} ${request.path}` },
            { status: 404 },
        ),

    methodNotAllowed: ({ request }: Context) =>
        HttpResponse.json(
            { message: `Method ${request.method.toUpperCase()} not allowed for ${request.path}` },
            { status: 405 },
        ),

    /**
     * Every documented operation lands here: no operation-specific handler
     * is ever registered. `mockResponseForOperation` prefers a named
     * example, then `example`, then generates a body from the response
     * schema, and defaults to the lowest documented 2xx status.
     */
    notImplemented: ({ operation }: Context) => {
        const { status, mock } = api.mockResponseForOperation(operation.operationId!)
        return HttpResponse.json(mock, { status })
    },
})

/** `init()` is expensive (parse + dereference + compile), so run it once. */
let ready: Promise<unknown> | null = null

function init() {
    if (!ready) ready = api.init()
    return ready
}

/** JSON body, or `undefined` when absent or unparseable. */
async function readBody(request: Request): Promise<unknown> {
    if (!BODY_METHODS.has(request.method.toUpperCase())) return undefined

    try {
        const text = await request.clone().text()
        return text ? JSON.parse(text) : undefined
    } catch {
        return undefined
    }
}

/**
 * Routes a Fetch API `Request` through the OpenAPI document and always
 * resolves to a real `Response`. Shared by the browser worker and Node.
 */
export async function handleWithOpenApi(request: Request): Promise<Response> {
    await init()

    const url = new URL(request.url)
    const query: Record<string, string | string[]> = {}

    for (const key of new Set(url.searchParams.keys())) {
        const values = url.searchParams.getAll(key)
        query[key] = values.length > 1 ? values : values[0]
    }

    const response = await api.handleRequest({
        method: request.method,
        path: url.pathname,
        query,
        headers: Object.fromEntries(request.headers),
        body: await readBody(request),
    })

    return response instanceof Response
        ? response
        : HttpResponse.json({ message: 'Mock engine produced no response' }, { status: 500 })
}
