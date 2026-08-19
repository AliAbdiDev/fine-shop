import 'server-only'

import { cookies } from 'next/headers'

import { type CookieName } from '@/core/types/cookei'

import { type CookieInput, type TypedCookie } from './types'

export async function getCookie(name: CookieName): Promise<TypedCookie | undefined> {
    const store = await cookies()
    const cookie = store.get(name)

    return cookie ? { name, value: cookie.value } : undefined
}

export async function getCookieValue(name: CookieName): Promise<string | undefined> {
    const store = await cookies()

    return store.get(name)?.value
}

export async function setCookie({ name, value, options }: CookieInput): Promise<void> {
    const store = await cookies()
    const cookieValue = typeof value === 'string' ? value : JSON.stringify(value)
    store.set(name, cookieValue, options)
}

export async function deleteCookie(name: CookieName): Promise<void> {
    const store = await cookies()
    store.delete(name)
}
