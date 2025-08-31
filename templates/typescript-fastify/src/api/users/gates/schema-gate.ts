/**
 * BRIK v5 Schema Validation Gate
 */

import { z } from 'zod';
import { RequestGate, GateResult } from './gate-result.js';

export interface SchemaValidationInput {
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
}

export interface ValidatedData {
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
}

export class SchemaGate implements RequestGate<SchemaValidationInput, ValidatedData> {
  readonly name = 'SchemaGate';

  constructor(
    private readonly schemas: {
      body?: z.ZodSchema;
      params?: z.ZodSchema;
      query?: z.ZodSchema;
      headers?: z.ZodSchema;
    }
  ) {}

  async validate(input: SchemaValidationInput): Promise<GateResult<ValidatedData>> {
    const startTime = Date.now();

    try {
      const validated: ValidatedData = {};

      // Validate body
      if (this.schemas.body && input.body !== undefined) {
        const result = this.schemas.body.safeParse(input.body);
        if (!result.success) {
          return GateResult.failure(
            'SCHEMA_VALIDATION_FAILED',
            `Body validation failed: ${this.formatZodErrors(result.error)}`,
            400,
            'SchemaGate',
            Date.now() - startTime
          );
        }
        validated.body = result.data;
      }

      // Validate params
      if (this.schemas.params && input.params !== undefined) {
        const result = this.schemas.params.safeParse(input.params);
        if (!result.success) {
          return GateResult.failure(
            'SCHEMA_VALIDATION_FAILED',
            `Path parameters validation failed: ${this.formatZodErrors(result.error)}`,
            400,
            'SchemaGate',
            Date.now() - startTime
          );
        }
        validated.params = result.data;
      }

      // Validate query
      if (this.schemas.query && input.query !== undefined) {
        const result = this.schemas.query.safeParse(input.query);
        if (!result.success) {
          return GateResult.failure(
            'SCHEMA_VALIDATION_FAILED',
            `Query parameters validation failed: ${this.formatZodErrors(result.error)}`,
            400,
            'SchemaGate',
            Date.now() - startTime
          );
        }
        validated.query = result.data;
      }

      // Validate headers
      if (this.schemas.headers && input.headers !== undefined) {
        const result = this.schemas.headers.safeParse(input.headers);
        if (!result.success) {
          return GateResult.failure(
            'SCHEMA_VALIDATION_FAILED',
            `Headers validation failed: ${this.formatZodErrors(result.error)}`,
            400,
            'SchemaGate',
            Date.now() - startTime
          );
        }
        validated.headers = result.data;
      }

      return GateResult.success(validated, Date.now() - startTime);

    } catch (error) {
      return GateResult.failure(
        'SCHEMA_INTERNAL_ERROR',
        'Internal schema validation error',
        500,
        'SchemaGate',
        Date.now() - startTime
      );
    }
  }

  private formatZodErrors(error: z.ZodError): string {
    return error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
  }
}

// Common schemas
export const CreateUserSchema = z.object({
  email: z.string().email('Must be a valid email'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(18, 'Must be at least 18 years old').max(120, 'Age seems unrealistic'),
  profile: z.object({
    bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
    website: z.string().url('Must be a valid URL').optional(),
  }).optional()
});

export const UserIdParamsSchema = z.object({
  id: z.string().uuid('Must be a valid UUID')
});

export const IdempotencyHeadersSchema = z.object({
  'idempotency-key': z.string().min(1, 'Idempotency-Key header is required'),
  'x-correlation-id': z.string().optional()
});

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['created_at', 'updated_at', 'name']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc')
});