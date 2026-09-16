import { z } from 'zod';

export const accountUserSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string(),
  title: z.string().optional(),
  birth_day: z.string().optional(),
  birth_month: z.string().optional(),
  birth_year: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  company: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional()
});

export const accountMessageResponseSchema = z.object({
  responseCode: z.number(),
  message: z.string()
});

export const accountDetailsResponseSchema = z.object({
  responseCode: z.number(),
  message: z.string().optional(),
  user: accountUserSchema.optional()
});
