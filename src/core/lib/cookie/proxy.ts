import type { NextRequest, NextResponse } from 'next/server'


import { type CookieName } from '@/core/types/cookei'

import type { CookieInput, TypedCookie } from './types'

export function requestCookies(req: NextRequest) {
    return {
        get(name: CookieName): TypedCookie | undefined {
            const cookie = req.cookies.get(name)

            return cookie ? { name, value: cookie.value } : undefined
        },

        value(name: CookieName): string | undefined {
            return req.cookies.get(name)?.value
        },

        has(name: CookieName): boolean {
            return req.cookies.has(name)
        },

        all(): TypedCookie[] {
            return req.cookies.getAll().map(({ name, value }) => ({
                name: name as CookieName,
                value,
            }))
        },
    }
}

export function responseCookies(res: NextResponse) {
    return {
        set({ name, value, options }: CookieInput): void {
            const cookieValue = typeof value === 'string' ? value : JSON.stringify(value)
            res.cookies.set(name, cookieValue, options)
        },

        delete(name: CookieName): void {
            res.cookies.delete(name)
        },
    }
}
