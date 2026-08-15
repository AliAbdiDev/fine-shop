import { ws } from 'msw'
import { setupWorker } from 'msw/browser'

import { BASE, getHandlers } from './handlers'
import { attachLogger, banner, onUnhandledRequest } from './logger'

/**
 * MSW patches the global WebSocket, which makes Next.js HMR warn/hang.
 * `addEventListener` returns a WebSocketHandler — that is what the worker needs.
 * `server.connect()` forwards the socket to the real dev server (passthrough).
 */
function hmrPassthrough() {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
    const link = ws.link(`${protocol}://${location.host}/_next/webpack-hmr`)

    return link.addEventListener('connection', ({ server }) => server.connect())
}

export async function startMocking() {
    const handlers = await getHandlers()
    const worker = setupWorker(...handlers, hmrPassthrough())

    attachLogger(worker, 'browser')

    await worker.start({
        onUnhandledRequest,
        quiet: true, // our own banner replaces the default one
        serviceWorker: { url: '/mockServiceWorker.js' },
    })

    banner('browser', BASE)
}
