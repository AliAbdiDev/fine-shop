import { NextResponse, type NextProxy, type ProxyConfig } from 'next/server'

import { authRedirect } from '@/core/lib/proxy-modules/auth'

export const proxy: NextProxy = (req) => {
    const redirectResponse = authRedirect(req);
    if (redirectResponse) return redirectResponse;
    return NextResponse.next();
};

export const config: ProxyConfig = {
    matcher: ['/((?!api|_next/static|_next/image|fonts|favicon.ico|mockServiceWorker.js).*)'],
}
