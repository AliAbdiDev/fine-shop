"use server";

import { redirect } from "next/navigation";

import type { ServerErrorPayload } from "@/core/components/custom/SmartForm";
import { APP_MODE } from "@/core/constants/misc";
import { ROUTES } from "@/core/constants/routes";
import { setCookie } from "@/core/lib/cookie/server";
import { type CookieOptions } from "@/core/lib/cookie/types";
import { api } from "@/core/services/configs/api";

type LoginEmailValues = { email: string };
type LoginOtpValues = { otp: string; email: string };

type ActionError = ServerErrorPayload<Record<string, unknown>>;

export async function sendLoginEmail({
    email,
}: LoginEmailValues): Promise<ActionError | void> {
    const r = await api.post("/account/login/", { email });

    if (!r.ok) {
        return {
            fields: { email: "ایمیل پذیرفته نشد" },
        };
    }

    redirect(`${ROUTES.SIGNIN_VERIFY}?email=${encodeURIComponent(email)}`);
}

export async function sendLoginOtp({
    otp,
    email,
}: LoginOtpValues): Promise<ActionError | void> {
    const r = await api.post<{ user: unknown, token: string }>("/account/otp/", { otp, email });

    if (!r.ok) {
        return {
            message: "کد وارد‌شده نامعتبر است یا منقضی شده.",
            fields: { otp: "کد را دوباره بررسی کنید." },
        };
    }

    const cookeOptions: CookieOptions = {
        httpOnly: true,
        secure: APP_MODE.isProd,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 day
    };

    console.log("🚀 ~ sendLoginOtp ~ r.data:", r.data)
    console.log("🚀 ~ sendLoginOtp ~ r.data:", r.data.user)
    if (r.data) {

        await setCookie({
            name: 'user-profile',
            value: r.data.user,
            options: cookeOptions
        });

    }

    if (r.data?.token) {

        await setCookie({
            name: 'token',
            value: r.data?.token,
            options: cookeOptions,
        });
        redirect(ROUTES.HOME);
    }

}
