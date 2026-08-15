import { setupServer } from 'msw/node'

import { BASE, getHandlers } from './handlers'
import { attachLogger, banner, onUnhandledRequest } from './logger'

export async function initServer() {
    const handlers = await getHandlers()
    const server = setupServer(...handlers)

    attachLogger(server, 'node')
    server.listen({ onUnhandledRequest })

    banner('node', handlers.length, BASE)
}
