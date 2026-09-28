import { z } from 'zod'

import { type Product } from './types/entities.types'

export const emailShema = z.email({
    error: "ایمیل وارد شده نامعتبر است"
}).lowercase().trim()

const stringSchema = z.string('لطفا مقداری را وارد کنید').trim()
const numberSchema = z.coerce.number('لطفا عدد وارد کنید')
const minCharacter = (number: number) => stringSchema.min(number, `حداقل باید ${number} وارد کنید `)
const maxCharacter = (number = 100) => stringSchema.max(number, `حداکثر ${number} کاراکتر میتوانید وارد کنید`)

// ------------- Product --------------
export const productSchema = z.object({
    name: maxCharacter(),
    basePrice: numberSchema,
    stock: numberSchema,
    category: maxCharacter(),
    images: z.array(
        z.union(
            [z.object({ url: z.url('لطفا آدرس سایت را وارد کنید'), alt: stringSchema }), z.file('لطفا فایل تصویر را وارد کنید').refine((file) => file.size <= 5 * 1024 * 1024, {
                message: 'حجم هر تصویر نباید بیشتر از 5 مگابایت باشد.',
            }),]
        )
    ).min(1, 'حداقل یک تصویر را آپلود کنید').max(8, 'حداکثر تعداد مجاز اپلود 8 تصویر است'),
    isAvailable: z.boolean(),
    description: maxCharacter(5000).optional(),
    discountedPrice: numberSchema.optional(),
    attributeList: z.array(z.object({
        key: stringSchema,
        values: z.array(maxCharacter()),
    })).optional()

}).superRefine((data, ctx) => {
    if (
        (data.discountedPrice !== undefined && data.discountedPrice !== 0) &&
        data.discountedPrice >= data.basePrice
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["discountedPrice"],
            message: "قیمت با تخفیف نمی‌تواند مساوی یا بیشتر از قیمت اصلی باشد",
        });
    }
}) satisfies z.ZodType<Product>;