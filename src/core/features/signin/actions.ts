"use server";

import { redirect } from "next/navigation";

import type { ServerErrorPayload } from "@/core/components/custom/SmartForm";
import { APP_MODE, ROLE_HOME, ROUTES } from "@/core/constants/misc";
import { setCookie } from "@/core/lib/cookie/serverCookie";
import { type CookieOptions } from "@/core/lib/cookie/types";
import { api } from "@/core/services/configs/api";
import { type SuccessEnvelope } from "@/core/services/configs/fetcher/fetcher.type";

type LoginEmailValues = { email: string; };
type LoginOtpValues = { otp: string; email: string; };
type ActionError = ServerErrorPayload<Record<string, unknown>>;

export async function sendLoginEmail({
    email,
}: LoginEmailValues): Promise<ActionError | void> {
    const r = await api.post("/account/login/", { email });
    if (!r.ok) return { fields: { email: "ایمیل پذیرفته نشد" } };
    const params = new URLSearchParams({ email });
    redirect(`${ROUTES.SIGNIN_VERIFY}?${params.toString()}`);
}

export async function sendLoginOtp({
    otp,
    email,
}: LoginOtpValues): Promise<ActionError | void> {
    const r = await api.post<SuccessEnvelope<{ user: { email: string; phoneNumber: string; isSuperuser: boolean } }>>("/account/otp/", { otp, email });

    if (!r.ok)
        return {
            message: "کد وارد‌شده نامعتبر است یا منقضی شده.",
            fields: { otp: "کد را دوباره بررسی کنید." },
        };

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

        const finalRedirectPath = ROLE_HOME[user?.isSuperuser ? 'admin' : 'buyer']

        redirect(finalRedirectPath, 'replace');
    }
}
