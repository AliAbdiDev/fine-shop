import { type FetchError } from "ofetch";

export const isPlainData = (v: unknown): v is Record<string, unknown> | unknown[] =>
    !!v &&
    typeof v === 'object' &&
    (Array.isArray(v) ||
        Object.getPrototypeOf(v) === Object.prototype ||
        Object.getPrototypeOf(v) === null);

export const isFetchError = (e: unknown): e is FetchError =>
    e instanceof Error && 'response' in e;

/** `skipTransform` isn't part of ofetch's option type, so it's read via a narrow cast. */
export const shouldTransform = (options: object): boolean =>
    !('skipTransform' in options && options.skipTransform === true);
