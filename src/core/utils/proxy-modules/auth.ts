import { NextResponse, type NextRequest } from 'next/server'

import { type Role, ROLE_HOME, ROLES, ROUTES } from '@/core/constants/misc'
import { type User } from '@/core/types/entities.types'
import { requestCookies } from '@/core/utils/cookie/proxyCookie'


const GUEST_ONLY_ROUTES = [ROUTES.SIGNIN_VERIFY, ROUTES.SIGNIN]
const ADMIN_ONLY_ROUTES = [ROUTES.ADMIN]
const BUYER_ONLY_ROUTES = ['/temp']

function isMatch(pathname: string, routes: string[]) {
    return routes.some(route => pathname === route || pathname.startsWith(route + '/'))
}

export function authRedirect(req: NextRequest) {
    const { pathname } = req.nextUrl

    // 1. Setup: get user info and route type
    const token = requestCookies(req).value<string>('token')
    const isLoggedIn = Boolean(token?.trim())

    let userRole: Role = ROLES.GUEST
    if (isLoggedIn) {
        const profile = requestCookies(req).value<User>('user-profile')
        userRole = profile?.isSuperuser ? ROLES.ADMIN : ROLES.BUYER
    }

    const isUserOnGuestRoute = isMatch(pathname, GUEST_ONLY_ROUTES)
    const isUserOnAdminRoute = isMatch(pathname, ADMIN_ONLY_ROUTES)
    const isUserOnBuyerRoute = isMatch(pathname, BUYER_ONLY_ROUTES)

    // -----------------------------------------------------------------
    // 2. Apply access rules based on route type (separate concerns)
    // -----------------------------------------------------------------

    // Rule 1: Guest-only pages (like login and sign-up)
    // These pages are only for users without a token.
    if (isUserOnGuestRoute) {
        if (isLoggedIn) {
            // If the user has a token, they should not be here. Redirect to their home page.
            return NextResponse.redirect(new URL(ROLE_HOME[userRole], req.url))
        }
        // If the user has no token (guest), allow access.
        return
    }

    // Rule 2: Protected pages (admin or buyer only)
    if (isUserOnAdminRoute || isUserOnBuyerRoute) {
        if (!isLoggedIn) {
            // If the user has no token, redirect to the login page.
            const redirectUrl = new URL(ROUTES.SIGNIN, req.url)
            return NextResponse.redirect(redirectUrl)
        }

        // If the user has a token, check their role.
        if ((isUserOnAdminRoute && userRole !== ROLES.ADMIN) || (isUserOnBuyerRoute && userRole !== ROLES.BUYER)) {
            // If the role does not match the route, redirect to their home page.
            return NextResponse.redirect(new URL(ROLE_HOME[userRole], req.url))
        }

        // If token and role are both correct, allow access.
        return
    }

    // Rule 3: Public pages
    // If we reach here, the route is neither guest-only nor protected.
    // So it is a public route and everyone (with or without token) can access it.
    return
}