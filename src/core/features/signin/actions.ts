'use server'

import { api, } from "@/core/services/configs/fetcher"
type sendEmail = { success: boolean };
export const sendEmail = async (formData: FormData) => {
    const email = formData.get('email') as string;

    const r = await api.post('/send-email', { email: email })
    console.log(r);
}