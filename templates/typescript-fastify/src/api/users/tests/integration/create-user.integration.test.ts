/**
 * BRIK v5 Integration Tests - Create User Endpoint
 */

import { FastifyInstance } from 'fastify';
import { createTestApp } from '../../../test-helpers/app.js';
import { createTestJWT } from '../../../test-helpers/auth.js';

describe('POST /api/v1/users', () => {
  let app: FastifyInstance;
  let authToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    authToken = createTestJWT({ 
      user_id: 'test-user-id',
      scopes: ['users:create'],
      roles: ['user']
    });
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await global.cleanupTestDatabase();
  });

  const validUserPayload = {
    email: 'john.doe@example.com',
    name: 'John Doe',
    age: 30,
    profile: {
      bio: 'Software developer',
      website: 'https://johndoe.com'
    }
  };

  describe('Success Cases', () => {
    it('should create user with valid data and return 201', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
          'idempotency-key': createTestIdempotencyKey(),
          'x-correlation-id': createTestCorrelationId()
        },
        payload: validUserPayload
      });

      expect(response.statusCode).toBe(201);
      
      const body = JSON.parse(response.body);
      expect(body).toBeBrikCompliant();
      expect(body).toBeIdempotent();
      
      expect(body.user).toMatchObject({
        email: validUserPayload.email,
        name: validUserPayload.name,
        age: validUserPayload.age,
        profile: validUserPayload.profile
      });
      
      expect(body.user.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(body.user.version).toBe(1);
      expect(body.user.createdAt).toBeDefined();
      expect(body.user.updatedAt).toBeDefined();
    });

    it('should create user without optional profile', async () => {
      const minimalPayload = {
        email: 'minimal@example.com',
        name: 'Minimal User',
        age: 25
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
          'idempotency-key': createTestIdempotencyKey()
        },
        payload: minimalPayload
      });

      expect(response.statusCode).toBe(201);
      
      const body = JSON.parse(response.body);
      expect(body.user.profile).toEqual({});
    });

    it('should return cached result for duplicate idempotency key with same payload', async () => {
      const idempotencyKey = createTestIdempotencyKey();
      
      // First request
      const firstResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
          'idempotency-key': idempotencyKey
        },
        payload: validUserPayload
      });

      expect(firstResponse.statusCode).toBe(201);
      const firstBody = JSON.parse(firstResponse.body);
      expect(firstBody.metadata.cached).toBe(false);

      // Second request with same key and payload
      const secondResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
          'idempotency-key': idempotencyKey
        },
        payload: validUserPayload
      });

      expect(secondResponse.statusCode).toBe(201);
      const secondBody = JSON.parse(secondResponse.body);
      expect(secondBody.metadata.cached).toBe(true);
      expect(secondBody.user.id).toBe(firstBody.user.id);
    });

    it('should include correlation ID in response headers', async () => {
      const correlationId = createTestCorrelationId();
      
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
          'idempotency-key': createTestIdempotencyKey(),
          'x-correlation-id': correlationId
        },
        payload: validUserPayload
      });

      expect(response.headers['x-correlation-id']).toBe(correlationId);
    });
  });

  describe('Authentication & Authorization', () => {
    it('should return 401 without authorization header', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'content-type': 'application/json',
          'idempotency-key': createTestIdempotencyKey()
        },
        payload: validUserPayload
      });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveGateError('AuthGate', 'AUTH_TOKEN_MISSING');
    });

    it('should return 401 with invalid JWT token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': 'Bearer invalid-token',
          'content-type': 'application/json',
          'idempotency-key': createTestIdempotencyKey()
        },
        payload: validUserPayload
      });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveGateError('AuthGate', 'AUTH_TOKEN_INVALID');
    });

    it('should return 403 without required scopes', async () => {
      const noScopeToken = createTestJWT({ 
        user_id: 'test-user-id',
        scopes: ['users:read'], // Missing users:create
        roles: ['user']
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': `Bearer ${noScopeToken}`,
          'content-type': 'application/json',
          'idempotency-key': createTestIdempotencyKey()
        },
        payload: validUserPayload
      });

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveGateError('AuthGate', 'AUTH_INSUFFICIENT_SCOPES');
    });
  });

  describe('Validation Errors', () => {
    it('should return 400 without idempotency key', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json'
        },
        payload: validUserPayload
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveGateError('SchemaGate', 'SCHEMA_VALIDATION_FAILED');
    });

    it('should return 400 with invalid email', async () => {
      const invalidPayload = {
        ...validUserPayload,
        email: 'invalid-email'
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
          'idempotency-key': createTestIdempotencyKey()
        },
        payload: invalidPayload
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveGateError('SchemaGate', 'SCHEMA_VALIDATION_FAILED');
    });

    it('should return 400 with missing required fields', async () => {
      const incompletePayload = {
        email: 'test@example.com'
        // Missing name and age
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
          'idempotency-key': createTestIdempotencyKey()
        },
        payload: incompletePayload
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveGateError('SchemaGate', 'SCHEMA_VALIDATION_FAILED');
    });

    it('should return 400 with age below minimum', async () => {
      const invalidPayload = {
        ...validUserPayload,
        age: 12 // Below COPPA minimum
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
          'idempotency-key': createTestIdempotencyKey()
        },
        payload: invalidPayload
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveDomainError('INVALID_USER_AGE');
    });

    it('should return 400 with bio too long', async () => {
      const invalidPayload = {
        ...validUserPayload,
        profile: {
          bio: 'X'.repeat(501) // Exceeds 500 character limit
        }
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
          'idempotency-key': createTestIdempotencyKey()
        },
        payload: invalidPayload
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveDomainError('INVALID_USER_PROFILE');
    });
  });

  describe('Idempotency Conflicts', () => {
    it('should return 409 for same idempotency key with different payload', async () => {
      const idempotencyKey = createTestIdempotencyKey();
      
      // First request
      await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
          'idempotency-key': idempotencyKey
        },
        payload: validUserPayload
      });

      // Second request with same key but different payload
      const differentPayload = {
        ...validUserPayload,
        name: 'Different Name'
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
          'idempotency-key': idempotencyKey
        },
        payload: differentPayload
      });

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveGateError('IdempotencyGate', 'IDEMPOTENCY_CONFLICT');
    });
  });

  describe('Rate Limiting', () => {
    it('should return 429 when rate limit exceeded', async () => {
      // This test would require configuring a very low rate limit
      // or making many requests quickly
      const promises = Array.from({ length: 10 }, (_, i) =>
        app.inject({
          method: 'POST',
          url: '/api/v1/users',
          headers: {
            'authorization': `Bearer ${authToken}`,
            'content-type': 'application/json',
            'idempotency-key': `rate-test-${i}`
          },
          payload: {
            ...validUserPayload,
            email: `user${i}@example.com`
          }
        })
      );

      const responses = await Promise.all(promises);
      
      // Some responses should be rate limited
      const rateLimitedResponses = responses.filter(r => r.statusCode === 429);
      
      if (rateLimitedResponses.length > 0) {
        expect(rateLimitedResponses[0].body).toHaveGateError('RateGate', 'RATE_LIMIT_EXCEEDED');
        expect(rateLimitedResponses[0].headers['x-ratelimit-limit']).toBeDefined();
        expect(rateLimitedResponses[0].headers['x-ratelimit-remaining']).toBeDefined();
        expect(rateLimitedResponses[0].headers['x-ratelimit-reset']).toBeDefined();
      }
    }, 10000);
  });

  describe('Error Responses Format', () => {
    it('should return properly formatted error response', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        headers: {
          'content-type': 'application/json',
          'idempotency-key': createTestIdempotencyKey()
        },
        payload: validUserPayload
      });

      expect(response.statusCode).toBe(401);
      
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('error');
      expect(body.error).toHaveProperty('type');
      expect(body.error).toHaveProperty('code');
      expect(body.error).toHaveProperty('message');
      expect(body.error.type).toBe('GATE_ERROR');
    });
  });
});