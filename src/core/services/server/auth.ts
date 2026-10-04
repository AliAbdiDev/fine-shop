"use server";

import { type Route } from "next";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { isNullOrUndefined } from "@sindresorhus/is";

import { ROLE_HOME, ROUTES } from "@/core/constants/misc";
import { api } from "@/core/services/configs/api";
import { type User } from "@/core/types/entities.types";
import { setCookie } from "@/core/utils/cookie/serverCookie";
import { type CookieValue } from "@/core/utils/cookie/types";

import { cookieOptions, profileKey, type Token } from "./misc";
import { type ApiResult } from "../configs/fetcher/types/client.types";

type LoginSuccessEnvelope = { data: { user: User }, token: string };
// ----------------------------------

type LoginEmailValues = { email: string };
type LoginOtpValues = { otp: string; email: string };

export const setUserProfileCookie = async (value: CookieValue<'user-profile'>) => {
    if (isNullOrUndefined(value.isSuperuser)) return
    await setCookie({ name: 'user-profile', value })
}

export async function actionSendLoginEmail({
    email,
}: LoginEmailValues): Promise<ApiResult<LoginSuccessEnvelope>> {
    const r = await api.post<LoginSuccessEnvelope>(
        "/account/login/",
        { email },
    );

    if (!r.ok) return r;

    const params = new URLSearchParams({ email });
    redirect(`${ROUTES.SIGNIN_VERIFY}?${params.toString()}` as Route);

}

export async function actionSendLoginOtpAction({
    otp,
    email,
}: LoginOtpValues): Promise<ApiResult<LoginSuccessEnvelope>> {
    const r = await api.post<LoginSuccessEnvelope>(
        "/account/otp/",
        { otp, email },
    );

    if (!r.ok) return r;

    const user = r.data?.data?.user;
    if (user) {
        await setCookie({
            name: "user-profile",
            value: {
                isSuperuser: user.isSuperuser,
            },
            options: cookieOptions,
        });
    }

    if (r.data?.token) {
        await setCookie({
            name: "token",
            value: r.data.token,
            options: cookieOptions,
        });

        const finalRedirectPath =
            ROLE_HOME[user?.isSuperuser ? "admin" : "buyer"];
        redirect(finalRedirectPath as Route, "replace");
    }

    return r;
}

export const actionLogout = async ({ token }: { token: Token }) => {
    if (isNullOrUndefined(token)) return;
    updateTag(profileKey(token))
}