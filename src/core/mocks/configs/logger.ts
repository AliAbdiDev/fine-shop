import type { SetupWorker } from 'msw/browser'

import schema from '../schema.json'

type Side = 'browser' | 'node'

/**
 * `SetupWorker['events']` and `SetupServer['events']` are both
 * `Emitter<LifeCycleEventsMap>`, so one type covers both instances.
 */
type MswInstance = { events: SetupWorker['events'] }

const TAG = (side: Side) => `[MSW:${side}]`
const short = (url: string) => new URL(url).pathname

const IGNORED_PATHS = [
    /^\/_next\//,
    /^\/__nextjs/,
    /^\/js\//,
    /\.(js|css|woff2?|ico|png|svg|map)$/,
]

const IGNORED_HOSTS = ['registry.npmjs.org']

/** Traffic that is framework plumbing, not API calls we care about. */
export function isNoise(request: Request): boolean {
    // Server Actions / RSC payloads: Next.js transport, never an API endpoint
    if (request.headers.has('next-action') || request.headers.has('rsc')) return true

    const url = new URL(request.url)
    if (url.protocol === 'ws:' || url.protocol === 'wss:') return true
    if (IGNORED_HOSTS.includes(url.hostname)) return true

    return IGNORED_PATHS.some((re) => re.test(url.pathname))
}

/** Shared `onUnhandledRequest` — warn only for genuine, unmocked API calls. */
export function onUnhandledRequest(
    request: Request,
    print: { warning: () => void },
) {
    if (isNoise(request)) return
    print.warning()
}

/** Attach unified logging to a worker or server instance. */
export function attachLogger({ events }: MswInstance, side: Side) {
    events.on('response:mocked', ({ request, response }) => {
        if (isNoise(request)) return
        console.log(
            `${TAG(side)} MOCK      ${request.method} ${short(request.url)} -> ${response.status}  (served by MSW, backend NOT contacted)`,
        )
    })

    events.on('response:bypass', ({ request, response }) => {
        if (isNoise(request)) return
        console.warn(
            `${TAG(side)} REAL API  ${request.method} ${short(request.url)} -> ${response.status}  (hit the real backend)`,
        )
    })

    events.on('request:unhandled', ({ request }) => {
        if (isNoise(request)) return
        console.warn(
            `${TAG(side)} UNHANDLED ${request.method} ${short(request.url)}  (no handler in schema -> will reach the real backend)`,
        )
    })
}

/**
 * Handlers are now a single catch-all, so their count says nothing useful.
 * Report the documented paths the engine can serve instead.
 */
export function banner(side: Side, base: string) {
    const paths = Object.keys(schema.paths).length

    console.log(
        `${TAG(side)} enabled | ${paths} documented paths | base=${base}\n` +
        `${TAG(side)} legend: MOCK = fake data · REAL API = live backend · UNHANDLED = missing handler`,
    )
}
