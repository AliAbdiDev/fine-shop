import { createHash } from "crypto";

import { APP_MODE } from "@/core/constants/misc";
import { type CookieOptions } from "@/core/utils/cookie/types";
// Types
export type Token = string | null | undefined

/* ----------------------------- Query Params ------------------------------ */
export type ProductSort =
    | "newest"
    | "oldest"
    | "price_asc"   // price ascending — cheapest first
    | "price_desc"  // price descending — most expensive first
    | "popular"
    | "discounted";

export interface ProductQueryParams {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    pageSize?: number;
    sort?: ProductSort;

    attributes?: Record<string, string>;
}

// Constats

export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: APP_MODE.isProd(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
};

//helpers
export function buildHash(input: string): string {
    return createHash("sha256").update(input).digest("hex").slice(0, 24);
}

export const profileKey = (token: string) => `profile-${buildHash(token)}`