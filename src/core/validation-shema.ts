import { z } from 'zod'

import { type User, type Product } from './types/entities.types'

export const emailShema = z.email({
    error: "ایمیل وارد شده نامعتبر است"
}).lowercase().trim()

const stringSchema = z.string('لطفا مقداری را وارد کنید').trim()
const numberSchema = z.coerce.number('لطفا عدد وارد کنید')
const minCharacter = (number: number) => stringSchema.min(number, `حداقل باید ${number} وارد کنید `)
const maxCharacter = (number = 100) => stringSchema.max(number, `حداکثر ${number} کاراکتر میتوانید وارد کنید`)

export const phoneNumberSchema = z
    .string("لطفا شماره تماس را وارد کنید")
    .trim()
    .regex(/^09\d{9}$/, "شماره تماس باید با 09 شروع شده و 11 رقم باشد");

//   ------------------------
export const userSchema = z
    .object({
        firstName: maxCharacter(50),
        lastName: maxCharacter(50),
        email: emailShema,
        phoneNumber: phoneNumberSchema,
        avatarUrl: z
            .union([
                z.url("لطفا آدرس تصویر را وارد کنید"),
                z.literal(""),
                z.null(),
            ])
            .optional(),
        isActive: z.boolean().default(true),
        isSuperuser: z.boolean().default(false),

    }) satisfies z.ZodType<User>;

export type UserFormValues = z.infer<typeof userSchema>;

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
        , 'لطفا تصویری را آپلود کنید').min(1, 'لطفا تصویری را آپلود کنید').max(8, 'حداکثر تعداد مجاز اپلود 8 تصویر است'),
    isAvailable: z.boolean(),
    description: maxCharacter(5000).optional(),
    discountedPrice: numberSchema.optional(),
    attributeList: z.array(z.object({
        key: stringSchema,
        values: z.array(maxCharacter()).default([]),
    })).optional()

}).superRefine((data, ctx) => {
    if (
        (data.discountedPrice !== undefined && data.discountedPrice !== 0) &&
        data.discountedPrice >= data.basePrice
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["discountedPrice"],
            message: "قیمت تخفیف نمی‌تواند مساوی یا بیشتر از قیمت اصلی باشد",
        });
    }
}) satisfies z.ZodType<Product>;


