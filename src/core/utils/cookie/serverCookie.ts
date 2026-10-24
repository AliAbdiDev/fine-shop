import 'server-only';
import { cookies } from 'next/headers';

import {
    JSON_COOKIES,
    type CookieInput,
    type CookieMap,
    type CookieName,
    type TypedCookie,
} from './types';

function serialize(name: CookieName, value: unknown): string {
    return JSON_COOKIES.has(name) ? JSON.stringify(value) : String(value);
}

function deserialize<N extends CookieName>(name: N, raw: string): CookieMap[N] {
    return (JSON_COOKIES.has(name) ? JSON.parse(raw) : raw) as CookieMap[N];
}

export async function getCookie<N extends CookieName>(
    name: N,
): Promise<TypedCookie<N> | undefined> {
    const store = await cookies();
    const cookie = store.get(name);
    if (!cookie) return undefined;

    return { name, value: deserialize(name, cookie.value) };
}

export async function getCookieValue<N extends CookieName>(
    name: N,
): Promise<CookieMap[N] | undefined> {
    const store = await cookies();
    const cookie = store.get(name);
    if (!cookie) return undefined;

    return deserialize(name, cookie.value);
}

export async function setCookie<N extends CookieName>({
    name,
    value,
    options,
}: CookieInput<N>): Promise<void> {
    const store = await cookies();
    store.set(name, serialize(name, value), options);
}

export async function deleteCookie(name: CookieName): Promise<void> {
    const store = await cookies();
    store.delete(name);
}