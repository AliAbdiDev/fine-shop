import { z } from 'zod'

export const emailShema = z.email({
    error: "ایمیل وارد شده نامعتبر است"
}).trim()