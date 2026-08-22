"use server";

import { redirect } from "next/navigation";

import type { ServerErrorPayload } from "@/core/components/custom/SmartForm";
import { APP_MODE } from "@/core/constants/misc";
import { ROUTES } from "@/core/constants/routes";
import { setCookie } from "@/core/lib/cookie/serverCookie";
import { type CookieOptions } from "@/core/lib/cookie/types";
import { api } from "@/core/services/configs/api";

type LoginEmailValues = { email: string; redirectTo: string };
type LoginOtpValues = { otp: string; email: string, redirectTo: string };

type ActionError = ServerErrorPayload<Record<string, unknown>>;

export async function sendLoginEmail({
    email,
    redirectTo
}: LoginEmailValues): Promise<ActionError | void> {
    const r = await api.post("/account/login/", { email });

    if (!r.ok) return {
        fields: { email: "ایمیل پذیرفته نشد" },
    };

    redirect(`${ROUTES.SIGNIN_VERIFY}?email=${email}&from=${redirectTo}`);
}

export async function sendLoginOtp({
    otp,
    email,
    redirectTo
}: LoginOtpValues): Promise<ActionError | void> {
    const r = await api.post<{
        data: {
            user: {
                email: string,
                phoneNumber: string,
                isSuperuser: boolean
            }
        }, token: string
    }>("/account/otp/", { otp, email });

    if (!r.ok) return {
        message: "کد وارد‌شده نامعتبر است یا منقضی شده.",
        fields: { otp: "کد را دوباره بررسی کنید." },
    };

    const cookeOptions: CookieOptions = {
        httpOnly: true,
        secure: APP_MODE.isProd,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 day
    };

    if (r.data.data.user) {
        await setCookie({
            name: 'user-profile',
            value: r.data.data.user,
            options: cookeOptions
        });
    }

    if (r.data?.token) {

        await setCookie({
            name: 'token',
            value: r.data?.token,
            options: cookeOptions,
        });

        const isSafeRedirect = redirectTo && redirectTo.startsWith('/');
        console.log("🚀 ~ sendLoginOtp ~ redirectTo:", redirectTo)
        const finalRedirectPath = isSafeRedirect ? redirectTo : ROUTES.HOME;

        redirect(finalRedirectPath, 'replace');
    }

}
