import type { NextRequest, NextResponse } from 'next/server'


import type { CookieInput, CookieName, TypedCookie } from './types'

function parseCookieValue(value: string | undefined): unknown | null {
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

export function requestCookies(req: NextRequest) {
    return {
        get(name: CookieName): TypedCookie | null {
            const cookie = req.cookies.get(name)
            if (!cookie) return null

            return { name, value: parseCookieValue(cookie.value) }
        },

        value<T = string>(name: CookieName): T | null {
            const val = req.cookies.get(name)?.value
            if (val === undefined) return null;
            return parseCookieValue(val) as T
        },

        has(name: CookieName): boolean {
            return req.cookies.has(name)
        },

        all(): TypedCookie[] {
            return req.cookies.getAll().map(({ name, value }) => ({
                name: name as CookieName,
                value: parseCookieValue(value),
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
