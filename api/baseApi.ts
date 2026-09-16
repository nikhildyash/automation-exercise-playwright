import { APIResponse } from '@playwright/test';
import { z } from 'zod';

export interface ApiEnvelope<T = unknown> {
  responseCode: number;
  message?: string;
  products?: T;
  brands?: T;
  user?: T;
}

export async function parseApiResponse<T>(
  response: APIResponse,
  schema?: z.ZodType<unknown>
): Promise<ApiEnvelope<T>> {
  const body = await response.text();

  try {
    const parsed = JSON.parse(body) as ApiEnvelope<T>;

    if (schema) {
      const validated = schema.safeParse(parsed);

      if (!validated.success) {
        throw new Error(
          `Schema validation failed for ${response.url()}: ${validated.error.issues
            .map(issue => `${issue.path.join('.') || 'root'}: ${issue.message}`)
            .join('; ')}`
        );
      }

      return validated.data as ApiEnvelope<T>;
    }

    return parsed;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Schema validation failed')) {
      throw error;
    }

    throw new Error(`Expected JSON from ${response.url()}, received: ${body.slice(0, 300)}`);
  }
}
