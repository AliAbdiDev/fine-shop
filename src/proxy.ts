import { NextResponse, type NextRequest } from 'next/server'

import { authRedirect } from '@/core/lib/proxy-modules/auth'

export default function proxy(req: NextRequest) {
    const redirectResponse = authRedirect(req)

    if (redirectResponse) return redirectResponse

    return NextResponse.next()
}

export const config = {
    // mockServiceWorker.js به لیست اضافه شد
    matcher: ['/((?!api|_next/static|_next/image|fonts|favicon.ico|mockServiceWorker.js).*)'],
}
