import { z } from 'zod'

import { type Product } from './types/entities.types'

export const emailShema = z.email({
    error: "ایمیل وارد شده نامعتبر است"
}).lowercase().trim()

// ------------- Product --------------

export const productSchema = z.object({
    name: z.string(),
    basePrice: z.number(),
    stock: z.number(),
    category: z.string(),
    categoryLabel: z.string(),
    images: z.array(
        z.object({
            url: z.string(),
            alt: z.string(),
        })
    ),
    description: z.string(),
    discountedPrice: z.number(),
    isAvailable: z.boolean(),

}) satisfies z.ZodType<Partial<Product>>;