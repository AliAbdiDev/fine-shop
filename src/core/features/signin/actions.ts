'use server'

import { redirect } from "next/navigation";

import { ROUTES } from "@/core/constants/routes";
import { api } from "@/core/services/configs/api";

export const sendLoginEmail = async ({ email }: { email: string }) => {

    const r = await api.post('/account/login/', { email: email })
    if (r.ok) {
        redirect(ROUTES.SIGNIN_VERIFY + `?email=${email}`)
    }

    console.log(r);
}
export const sendLoginOtp = async ({ otp, email }: { otp: string, email: string }) => {

    const r = await api.post('/account/otp/', { otp, email })
    if (r.ok) {
        console.log(r.data);
        // setCookie({ name: 'user', value: r.data })
    }

    console.log(r);
}