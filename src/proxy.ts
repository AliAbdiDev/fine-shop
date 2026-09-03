import { NextResponse, type NextProxy, type ProxyConfig } from 'next/server'

import { authRedirect } from '@/core/utils/proxy-modules/auth'

import { ROUTES } from './core/constants/misc';

export const proxy: NextProxy = (req) => {
    const redirectResponse = authRedirect(req);
    if (redirectResponse) return redirectResponse;

    if (req.nextUrl.pathname === ROUTES.ADMIN) {
        return NextResponse.redirect(new URL(ROUTES.ADMIN + '/' + ROUTES.PRODUCTS, req.url))
    }

    return NextResponse.next();
};

export const config: ProxyConfig = {
    matcher: ['/((?!api|_next/static|_next/image|fonts|favicon.ico|mockServiceWorker.js).*)'],
}
