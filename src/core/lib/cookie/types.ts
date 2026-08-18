import { type CookieName } from "@/core/types/cookei"


export interface TypedCookie {
    name: CookieName
    value: unknown
}

export interface CookieOptions {
    maxAge?: number
    expires?: Date
    path?: string
    domain?: string
    secure?: boolean
    httpOnly?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
}

export interface CookieInput extends TypedCookie {
    options?: CookieOptions
}
