/**
 * BRIK v5 Idempotency Gate
 */

import crypto from 'crypto';
import { RequestGate, GateResult } from './gate-result.js';

export interface IdempotencyInput {
  idempotencyKey: string;
  payload: any;
  ttlSeconds?: number;
}

export interface IdempotencyResult {
  isDuplicate: boolean;
  cachedResult?: any;
  cacheKey?: string;
  lockKey?: string;
}

export interface IdempotencyCache {
  get(key: string): Promise<any | null>;
  set(key: string, value: any, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

export class IdempotencyGate implements RequestGate<IdempotencyInput, IdempotencyResult> {
  readonly name = 'IdempotencyGate';

  constructor(
    private readonly cache: IdempotencyCache,
    private readonly defaultTtlSeconds: number = 3600
  ) {}

  async validate(input: IdempotencyInput): Promise<GateResult<IdempotencyResult>> {
    const startTime = Date.now();

    try {
      const { idempotencyKey, payload, ttlSeconds } = input;
      const ttl = ttlSeconds || this.defaultTtlSeconds;

      // 1. Generate payload fingerprint
      const payloadHash = this.generatePayloadHash(payload);
      const cacheKey = `idem:${idempotencyKey}:${payloadHash}`;
      const lockKey = `lock:${cacheKey}`;

      // 2. Check if we already have a cached result
      const cachedResult = await this.cache.get(cacheKey);
      if (cachedResult !== null) {
        return GateResult.success({
          isDuplicate: true,
          cachedResult,
          cacheKey
        }, Date.now() - startTime);
      }

      // 3. Check if another request with same key but different payload exists
      const conflictKey = await this.checkForConflictingRequest(idempotencyKey, payloadHash);
      if (conflictKey) {
        return GateResult.failure(
          'IDEMPOTENCY_CONFLICT',
          `Idempotency key '${idempotencyKey}' already used with different payload`,
          409,
          'IdempotencyGate',
          Date.now() - startTime
        );
      }

      // 4. Check for processing lock to prevent race conditions
      const isLocked = await this.cache.exists(lockKey);
      if (isLocked) {
        return GateResult.failure(
          'IDEMPOTENCY_PROCESSING',
          `Request with idempotency key '${idempotencyKey}' is already being processed`,
          409,
          'IdempotencyGate',
          Date.now() - startTime
        );
      }

      // 5. Acquire processing lock
      await this.cache.set(lockKey, 'processing', 300); // 5 minute lock

      return GateResult.success({
        isDuplicate: false,
        cacheKey,
        lockKey
      }, Date.now() - startTime);

    } catch (error) {
      return GateResult.failure(
        'IDEMPOTENCY_INTERNAL_ERROR',
        'Internal idempotency check error',
        500,
        'IdempotencyGate',
        Date.now() - startTime
      );
    }
  }

  async storeResult(
    cacheKey: string, 
    lockKey: string, 
    result: any, 
    ttlSeconds: number = 3600
  ): Promise<void> {
    try {
      // Store the result
      await this.cache.set(cacheKey, result, ttlSeconds);
      
      // Release the processing lock
      await this.cache.delete(lockKey);
    } catch (error) {
      // At least try to release the lock
      try {
        await this.cache.delete(lockKey);
      } catch (lockError) {
        // Log but don't throw - the lock will expire
      }
      throw error;
    }
  }

  async releaseLock(lockKey: string): Promise<void> {
    try {
      await this.cache.delete(lockKey);
    } catch (error) {
      // Log but don't throw - the lock will expire
    }
  }

  private generatePayloadHash(payload: any): string {
    // Normalize payload by sorting keys and removing undefined values
    const normalized = this.normalizePayload(payload);
    const payloadString = JSON.stringify(normalized);
    
    return crypto
      .createHash('sha256')
      .update(payloadString)
      .digest('hex');
  }

  private normalizePayload(obj: any): any {
    if (obj === null || obj === undefined) {
      return null;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.normalizePayload(item));
    }
    
    if (typeof obj === 'object') {
      const normalized: any = {};
      const sortedKeys = Object.keys(obj).sort();
      
      for (const key of sortedKeys) {
        const value = obj[key];
        if (value !== undefined) {
          normalized[key] = this.normalizePayload(value);
        }
      }
      
      return normalized;
    }
    
    return obj;
  }

  private async checkForConflictingRequest(
    idempotencyKey: string, 
    currentPayloadHash: string
  ): Promise<string | null> {
    // This is a simplified version - in production you might want to
    // scan for keys with the pattern `idem:${idempotencyKey}:*`
    // and check if any have a different hash
    
    // For now, we'll use a reverse lookup cache
    const keyMappingKey = `idem_key:${idempotencyKey}`;
    const existingHash = await this.cache.get(keyMappingKey);
    
    if (existingHash && existingHash !== currentPayloadHash) {
      return `idem:${idempotencyKey}:${existingHash}`;
    }
    
    if (!existingHash) {
      // Store the mapping for future conflict detection
      await this.cache.set(keyMappingKey, currentPayloadHash, 86400); // 24 hours
    }
    
    return null;
  }
}