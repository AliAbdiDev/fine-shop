import { z } from "zod";

import { type User, type Product, type Image } from "./types/entities.types";
import { type Override } from "./types/misc";

export const emailShema = z
    .email({ error: "ایمیل وارد شده نامعتبر است" })
    .lowercase()
    .trim();

const stringSchema = z.string("لطفا مقداری را وارد کنید").trim();
const numberSchema = z.coerce.number("لطفا عدد وارد کنید");

const maxCharacter = (number = 100) =>
    stringSchema.max(number, `حداکثر ${number} کاراکتر میتوانید وارد کنید`);

// ------------- Image Schemas --------------


// ------------- Phone --------------
export const phoneNumberSchema = z
    .string("لطفا شماره تماس را وارد کنید")
    .trim()
    .regex(/^09\d{9}$/, "شماره تماس باید با 09 شروع شده و 11 رقم باشد");

export const imageFile = z.file("لطفا فایل تصویر را وارد کنید").refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "حجم هر تصویر نباید بیشتر از 5 مگابایت باشد.",
})

// ------------- User (Profile) --------------
export const userSchema = z
    .object({
        firstName: maxCharacter().min(2, "حداقل ۲ کاراکتر وارد کنید"),
        lastName: maxCharacter().min(2, "حداقل ۲ کاراکتر وارد کنید"),
        phoneNumber: phoneNumberSchema,
        avatar: z.union([z.undefined(), z.null(), z.url("لطفا تصویری معتبر آپلود کنید"), imageFile,]),
    }) satisfies z.ZodType<Override<Omit<User, "email">, { avatar?: User['avatar'] | undefined | null }>>;

export type UserTypeSchema = z.infer<typeof userSchema>;

// ------------- Product --------------
export const productSchema = z
    .object({
        name: maxCharacter(),
        basePrice: numberSchema,
        stock: numberSchema,
        category: maxCharacter(),
        images: z
            .array(z.union(
                [
                    z.object(
                        {
                            url: z.url("لطفا تصویری معتبر آپلود کنید"),
                            alt: stringSchema,
                        },
                        "لطفا تصویری معتبر آپلود کنید",
                    ),
                    imageFile
                ],
                "لطفا تصویری را آپلود کنید",
            ) satisfies z.ZodType<Image>)
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