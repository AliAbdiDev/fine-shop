import { NextResponse, type NextRequest } from 'next/server'

import { type Role, ROLES } from '@/core/constants/misc'
import { ROUTES, type Route } from '@/core/constants/routes'
import { requestCookies } from '@/core/lib/cookie/proxy'

const ROLE_HOME: Record<Role, Route> = {
    [ROLES.GUEST]: ROUTES.SIGNIN,
    [ROLES.BUYER]: ROUTES.HOME,
    [ROLES.ADMIN]: ROUTES.DASHBOARD,
}

type RouteRule = {
    path: Route
    allowedRoles: Role[]
}

// ترتیب مهم است؛ مسیرهای خاص‌تر باید اول بیان.
// دقت کن که /signin/verify رو قبل از /signin گذاشتیم.
const RULES: RouteRule[] = [
    { path: ROUTES.SIGNIN_VERIFY, allowedRoles: [ROLES.GUEST] },
    { path: ROUTES.SIGNIN, allowedRoles: [ROLES.GUEST] },
    { path: ROUTES.DASHBOARD, allowedRoles: [ROLES.ADMIN] },
]

function matchRoute(pathname: string, path: Route) {
    return pathname === path || pathname.startsWith(path + '/')
}

/**
 * نقش کاربر را از کوکی user استخراج می‌کند.
 * اگر کوکی نبود یا نامعتبر بود، GUEST برمی‌گرداند.
 */
export function authGetRoleFromCookie(req: NextRequest): Role {
    const cookieValue = requestCookies(req).value('user')

    if (!cookieValue) return ROLES.GUEST

    try {
        const parsed = JSON.parse(cookieValue)
        const role = parsed?.role

        if (
            role === ROLES.GUEST ||
            role === ROLES.BUYER ||
            role === ROLES.ADMIN
        ) {
            return role as Role
        }

        return ROLES.GUEST
    } catch {
        return ROLES.GUEST
    }
}

/**
 * بر اساس نقش کاربر و مسیر فعلی، در صورت نیاز پاسخ ریدایرکت می‌سازد.
 */
export function authRedirectByRole(
    req: NextRequest,
    userRole: Role = ROLES.GUEST,
) {
    const { pathname } = req.nextUrl

    const matchedRule = RULES.find(({ path }) => matchRoute(pathname, path))

    if (!matchedRule || matchedRule.allowedRoles.includes(userRole)) return

    const url = req.nextUrl.clone()
    url.pathname = ROLE_HOME[userRole]
    url.search = ''
    if (userRole === ROLES.GUEST) url.searchParams.set('from', pathname)

    return NextResponse.redirect(url)
}
