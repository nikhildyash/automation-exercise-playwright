import { z } from 'zod';

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
  brand: z.string(),
  category: z.object({
    usertype: z.object({
      usertype: z.string()
    }),
    category: z.string()
  })
});

export const productsListResponseSchema = z.object({
  responseCode: z.number(),
  message: z.string().optional(),
  products: z.array(productSchema).optional(),
  brands: z.array(z.unknown()).optional()
});

export const productSearchResponseSchema = z.object({
  responseCode: z.number(),
  message: z.string().optional(),
  products: z.array(productSchema).optional()
});

export const brandsListResponseSchema = z.object({
  responseCode: z.number(),
  message: z.string().optional(),
  brands: z.array(z.unknown()).optional()
});
