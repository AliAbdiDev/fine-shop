"use server";

import { redirect } from "next/navigation";

import { APP_MODE, ROLE_HOME, ROUTES } from "@/core/constants/misc";
import { setCookie } from "@/core/lib/cookie/serverCookie";
import { type CookieOptions } from "@/core/lib/cookie/types";
import { api } from "@/core/services/configs/api";

import { type ApiResult } from "../configs/fetcher/types/client.types";
import { type SuccessEnvelope } from "../configs/fetcher/types/contract.types";

// ---------- Type Aliases ----------
type UserProfile = {
    email: string;
    phoneNumber: string;
    isSuperuser: boolean;
};

type LoginSuccessEnvelope = SuccessEnvelope<{ user: UserProfile }>;
// ----------------------------------

type LoginEmailValues = { email: string };
type LoginOtpValues = { otp: string; email: string };

export async function sendLoginEmail({
    email,
}: LoginEmailValues): Promise<ApiResult<SuccessEnvelope<undefined>>> {
    const r = await api.post<SuccessEnvelope<undefined>>(
        "/account/login/",
        { email },
    );

    if (!r.ok) {
        return r;
    }

    const params = new URLSearchParams({ email });
    redirect(`${ROUTES.SIGNIN_VERIFY}?${params.toString()}`);

    // این خط به‌خاطر redirect اجرا نمی‌شود ولی برای تایپ لازم است
    return r;
}

export async function sendLoginOtp({
    otp,
    email,
}: LoginOtpValues): Promise<ApiResult<LoginSuccessEnvelope>> {
    const r = await api.post<LoginSuccessEnvelope>(
        "/account/otp/",
        { otp, email },
    );

    if (!r.ok) return r;

    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: APP_MODE.isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    };

    const user = r.data?.data?.user;
    if (user) {
        await setCookie({
            name: "user-profile",
            value: {
                email: user.email,
                phoneNumber: user.phoneNumber,
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
        redirect(finalRedirectPath, "replace");
    }

    return r;
}