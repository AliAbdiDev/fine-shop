import { createHash } from "crypto";

import { APP_MODE } from "@/core/constants/misc";
import { type CookieOptions } from "@/core/utils/cookie/types";

export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: APP_MODE.isProd(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
};

export function buildHash(input: string): string {
    return createHash("sha256").update(input).digest("hex").slice(0, 24);
}

export type Token = string | null | undefined

export const profileKey = (token: string) => `profile-${buildHash(token)}`