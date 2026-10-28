import type { NextRequest, NextResponse } from 'next/server';

import {
    JSON_COOKIES,
    type CookieInput,
    type CookieMap,
    type CookieName,
    type TypedCookie,
} from './types';

function deserialize<N extends CookieName>(name: N, raw: string): CookieMap[N] {
    return (JSON_COOKIES.has(name) ? JSON.parse(raw) : raw) as CookieMap[N];
}

function serialize(name: CookieName, value: unknown): string {
    return JSON_COOKIES.has(name) ? JSON.stringify(value) : String(value);
}

export function requestCookies(req: NextRequest) {
    return {
        get<N extends CookieName>(name: N): TypedCookie<N> | null {
            const cookie = req.cookies.get(name);
            if (!cookie) return null;
            return { name, value: deserialize(name, cookie.value) };
        },

        value<N extends CookieName>(name: N): CookieMap[N] | null {
            const cookie = req.cookies.get(name);
            if (!cookie) return null;
            return deserialize(name, cookie.value);
        },

        has(name: CookieName): boolean {
            return req.cookies.has(name);
        },

        all(): TypedCookie[] {
            return req.cookies.getAll().map(({ name, value }) => ({
                name: name as CookieName,
                value: deserialize(name as CookieName, value),
            }));
        },
    };
}

export function responseCookies(res: NextResponse) {
    return {
        set<N extends CookieName>({ name, value, options }: CookieInput<N>): void {
            res.cookies.set(name, serialize(name, value), options);
        },
        delete(name: CookieName): void {
            res.cookies.delete(name);
        },
    };
}