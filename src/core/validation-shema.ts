import { z } from 'zod'

import { type Product } from './types/entities.types'

export const emailShema = z.email({
    error: "ایمیل وارد شده نامعتبر است"
}).lowercase().trim()

const stringSchema = z.string('لطفا مقداری را وارد کنید').trim()
const numberSchema = z.coerce.number('لطفا عدد وارد کنید')
const stringMax100 = stringSchema.max(100, 'حداکثر 100 کاراکتر')

// ------------- Product --------------
export const productSchema = z.object({
    name: stringMax100,
    basePrice: numberSchema,
    stock: numberSchema,
    category: stringMax100,
    categoryLabel: stringMax100,
    images: z.array(z.file()).min(1, 'حداقل یک تصویر آپلود کنید').default([]),
    isAvailable: z.boolean(),
    description: stringSchema.max(5000, 'حداکثر 5000 کاراکتر').optional(),
    discountedPrice: numberSchema.optional(),
    attributeList: z.array(z.object({
        key: stringSchema,
        values: z.array(stringMax100),
    })).optional()

}) satisfies z.ZodType<Product>;