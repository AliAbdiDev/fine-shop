import { NextResponse, type NextRequest } from 'next/server'

import { authGetRoleFromCookie, authRedirectByRole } from '@/core/lib/proxy-modules/auth'

export default function proxy(req: NextRequest) {
    const role = authGetRoleFromCookie(req)
    const redirectResponse = authRedirectByRole(req, role)

    if (redirectResponse) return redirectResponse

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|fonts|favicon.ico).*)'],
}