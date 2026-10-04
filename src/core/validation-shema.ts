import { z } from "zod";

import { type User, type Product, type Image } from "./types/entities.types";

export const emailShema = z
    .email({ error: "ایمیل وارد شده نامعتبر است" })
    .lowercase()
    .trim();

const stringSchema = z.string("لطفا مقداری را وارد کنید").trim();
const numberSchema = z.coerce.number("لطفا عدد وارد کنید");

const maxCharacter = (number = 100) =>
    stringSchema.max(number, `حداکثر ${number} کاراکتر میتوانید وارد کنید`);

const imageShema = z.union(
    [
        z.object({
            url: z.url("لطفا آدرس سایت را وارد کنید"),
            alt: stringSchema,
        }, "لطفا تصویری معتبر آپلود کنید"),
        z
            .file("لطفا فایل تصویر را وارد کنید")
            .refine((file) => file.size <= 5 * 1024 * 1024, {
                message: "حجم هر تصویر نباید بیشتر از 5 مگابایت باشد.",
            }),
    ],
    "لطفا تصویری را آپلود کنید",
) satisfies z.ZodType<Image>

export const phoneNumberSchema = z
    .string("لطفا شماره تماس را وارد کنید")
    .trim()
    .regex(/^09\d{9}$/, "شماره تماس باید با 09 شروع شده و 11 رقم باشد");


// ------------- User (Profile) --------------
export const userSchema = z
    .object({
        firstName: maxCharacter(50).min(2, "حداقل ۲ کاراکتر وارد کنید"),
        lastName: maxCharacter(50).min(2, "حداقل ۲ کاراکتر وارد کنید"),
        phoneNumber: phoneNumberSchema,
        avatar: imageShema.optional(),
    }) satisfies z.ZodType<Omit<User, 'email'>>;

export type UserTypeSchema = z.infer<typeof userSchema>;

// ------------- Product --------------
export const productSchema = z
    .object({
        name: maxCharacter(),
        basePrice: numberSchema,
        stock: numberSchema,
        category: maxCharacter(),
        images: z
            .array(imageShema)
            .min(1, "لطفا تصویری را آپلود کنید")
            .max(8, "حداکثر تعداد مجاز اپلود 8 تصویر است"),
        isAvailable: z.boolean(),
        description: maxCharacter(5000).optional(),
        discountedPrice: numberSchema.optional(),
        attributeList: z
            .array(
                z.object({
                    key: stringSchema,
                    values: z.array(maxCharacter()).default([]),
                }),
            )
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.discountedPrice !== undefined &&
            data.discountedPrice !== 0 &&
            data.discountedPrice >= data.basePrice
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["discountedPrice"],
                message: "قیمت تخفیف نمی‌تواند مساوی یا بیشتر از قیمت اصلی باشد",
            });
        }
    }) satisfies z.ZodType<Product>;