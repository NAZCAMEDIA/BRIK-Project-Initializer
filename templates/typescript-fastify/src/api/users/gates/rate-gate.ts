/**
 * BRIK v5 Rate Limiting Gate
 */

import { RequestGate, GateResult } from './gate-result.js';

export interface RateLimit {
  requests: number;
  windowSeconds: number;
  key?: string; // Optional custom key, falls back to IP
}

export interface RateLimitInput {
  identifier: string; // User ID, IP, or custom identifier
  customLimits?: RateLimit[];
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
  windowSeconds: number;
}

export interface RateLimitStore {
  increment(key: string, windowSeconds: number): Promise<{
    count: number;
    resetTime: Date;
  }>;
  get(key: string): Promise<{
    count: number;
    resetTime: Date;
  } | null>;
}

export class RateGate implements RequestGate<RateLimitInput, RateLimitResult> {
  readonly name = 'RateGate';

  constructor(
    private readonly store: RateLimitStore,
    private readonly defaultLimits: RateLimit[] = [
      { requests: 100, windowSeconds: 60 }, // 100 req/min default
      { requests: 1000, windowSeconds: 3600 }, // 1000 req/hour default
    ]
  ) {}

  async validate(input: RateLimitInput): Promise<GateResult<RateLimitResult>> {
    const startTime = Date.now();

    try {
      const { identifier, customLimits } = input;
      const limitsToCheck = customLimits || this.defaultLimits;

      // Check each rate limit
      for (const limit of limitsToCheck) {
        const key = `rate:${limit.key || 'default'}:${identifier}:${limit.windowSeconds}`;
        
        const result = await this.store.increment(key, limit.windowSeconds);
        
        if (result.count > limit.requests) {
          return GateResult.failure(
            'RATE_LIMIT_EXCEEDED',
            `Rate limit exceeded: ${result.count}/${limit.requests} requests in ${limit.windowSeconds}s window`,
            429,
            'RateGate',
            Date.now() - startTime
          );
        }

        // Return info for the most restrictive limit that was checked
        if (result.count === limit.requests) {
          const rateLimitResult: RateLimitResult = {
            allowed: true,
            limit: limit.requests,
            remaining: limit.requests - result.count,
            resetTime: result.resetTime,
            windowSeconds: limit.windowSeconds
          };

          return GateResult.success(rateLimitResult, Date.now() - startTime);
        }
      }

      // If we get here, none of the limits were exceeded
      // Return info for the first/primary limit
      const primaryLimit = limitsToCheck[0];
      const key = `rate:${primaryLimit.key || 'default'}:${identifier}:${primaryLimit.windowSeconds}`;
      const result = await this.store.get(key);

      const rateLimitResult: RateLimitResult = {
        allowed: true,
        limit: primaryLimit.requests,
        remaining: primaryLimit.requests - (result?.count || 0),
        resetTime: result?.resetTime || new Date(Date.now() + primaryLimit.windowSeconds * 1000),
        windowSeconds: primaryLimit.windowSeconds
      };

      return GateResult.success(rateLimitResult, Date.now() - startTime);

    } catch (error) {
      return GateResult.failure(
        'RATE_LIMIT_INTERNAL_ERROR',
        'Internal rate limiting error',
        500,
        'RateGate',
        Date.now() - startTime
      );
    }
  }
}

// In-memory rate limit store (for development/testing)
export class InMemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, { count: number; resetTime: Date }>();

  async increment(key: string, windowSeconds: number): Promise<{
    count: number;
    resetTime: Date;
  }> {
    const now = new Date();
    const existing = this.store.get(key);

    // Check if window has expired
    if (existing && now >= existing.resetTime) {
      this.store.delete(key);
    }

    const current = this.store.get(key);
    
    if (current) {
      current.count++;
      this.store.set(key, current);
      return current;
    } else {
      const newEntry = {
        count: 1,
        resetTime: new Date(now.getTime() + windowSeconds * 1000)
      };
      this.store.set(key, newEntry);
      return newEntry;
    }
  }

  async get(key: string): Promise<{
    count: number;
    resetTime: Date;
  } | null> {
    const now = new Date();
    const existing = this.store.get(key);

    if (!existing) {
      return null;
    }

    // Check if window has expired
    if (now >= existing.resetTime) {
      this.store.delete(key);
      return null;
    }

    return existing;
  }

  // Cleanup method for testing
  clear(): void {
    this.store.clear();
  }
}

// Predefined rate limit configurations
export const RateLimitPresets = {
  CONSERVATIVE: [
    { requests: 60, windowSeconds: 60 }, // 1 req/second average
    { requests: 500, windowSeconds: 3600 }, // 500 req/hour
  ],
  MODERATE: [
    { requests: 100, windowSeconds: 60 }, // ~1.67 req/second average
    { requests: 1000, windowSeconds: 3600 }, // 1000 req/hour
  ],
  GENEROUS: [
    { requests: 300, windowSeconds: 60 }, // 5 req/second average
    { requests: 10000, windowSeconds: 3600 }, // 10k req/hour
  ],
  API_HEAVY: [
    { requests: 1000, windowSeconds: 60 }, // ~16.67 req/second average
    { requests: 50000, windowSeconds: 3600 }, // 50k req/hour
  ]
} as const;