import { type User } from "@/core/types/entities.types";

export type CookieMap = {
    token: string;
    'user-profile': User;
}

export type CookieName = keyof CookieMap;

export type CookieValue<N extends CookieName> = CookieMap[N];

export const JSON_COOKIES: ReadonlySet<CookieName> = new Set(['user-profile']);
export interface TypedCookie<N extends CookieName = CookieName> {
    name: N;
    value: CookieMap[N];
}

export interface CookieOptions {
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

export interface CookieInput<N extends CookieName = CookieName>
    extends TypedCookie<N> {
    options?: CookieOptions;
}