'use server'

import { api, } from "@/core/services/fetcher/fetcher"
type sendEmail = { success: boolean };
export const sendEmail = async (formData: FormData) => {
    const email = formData.get('email') as string;
    console.log("🚀 ~ sendEmail ~ email:", email)

    const r = await api.post('/account/login/', { email: email })
    console.log(r);
}