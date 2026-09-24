import { z } from 'zod'

import { type Product } from './types/entities.types'

export const emailShema = z.email({
    error: "ایمیل وارد شده نامعتبر است"
}).lowercase().trim()

const stringSchema = z.string('لطفا مقداری را وارد کنید')
const numberSchema = z.coerce.number('لطفا عدد وارد کنید')
// ------------- Product --------------
export const productSchema = z.object({
    name: stringSchema.trim(),
    basePrice: numberSchema,
    stock: numberSchema,
    category: stringSchema.trim(),
    categoryLabel: stringSchema.trim(),
    images: z.array(z.file()).min(1, 'حداقل یک تصویر آپلود کنید').default([]),
    isAvailable: z.boolean(),
    description: stringSchema.trim().optional(),
    discountedPrice: numberSchema.optional(),
    attributeList: z.array(z.object({
        key: stringSchema,
        values: z.array(stringSchema),
    })).optional()

}) satisfies z.ZodType<Product>;