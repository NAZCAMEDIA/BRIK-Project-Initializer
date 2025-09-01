/**
 * BRIK v5 Authentication Gate
 */

import jwt from 'jsonwebtoken';
import { RequestGate, GateResult } from './gate-result.js';
import { FastifyRequest } from 'fastify';

export interface AuthContext {
  userId: string;
  scopes: string[];
  email?: string;
  roles?: string[];
}

export interface SecurityScope {
  resource: string;
  action: string;
  constraints?: {
    ownedOnly?: boolean;
    departmentOnly?: boolean;
    adminOnly?: boolean;
  };
}

export class AuthGate implements RequestGate<FastifyRequest, AuthContext> {
  readonly name = 'AuthGate';

  constructor(
    private readonly jwtSecret: string, // Injected from process.env.JWT_SECRET
    private readonly requiredScopes: SecurityScope[]
  ) {}

  async validate(request: FastifyRequest): Promise<GateResult<AuthContext>> {
    const startTime = Date.now();

    try {
      // 1. Extract JWT token
      const token = this.extractBearerToken(request);
      if (!token) {
        return GateResult.failure(
          'AUTH_TOKEN_MISSING',
          'Authorization header with Bearer auth is required',
          401,
          'AuthGate',
          Date.now() - startTime
        );
      }

      // 2. Verify JWT signature and decode
      let payload: any;
      try {
        payload = jwt.verify(token, this.jwtSecret /* from env */) as any;
      } catch (error) {
        return GateResult.failure(
          'AUTH_TOKEN_INVALID',
          'Invalid or expired JWT auth',
          401,
          'AuthGate',
          Date.now() - startTime
        );
      }

      // 3. Extract auth context
      const authContext: AuthContext = {
        userId: payload.sub || payload.user_id,
        scopes: payload.scopes || [],
        email: payload.email,
        roles: payload.roles || []
      };

      // 4. Validate required scopes
      const scopeValidation = this.validateScopes(
        authContext.scopes, 
        authContext.roles || [], 
        this.requiredScopes
      );

      if (!scopeValidation.isValid) {
        return GateResult.failure(
          'AUTH_INSUFFICIENT_SCOPES',
          `Missing required scope: ${scopeValidation.missingScope}`,
          403,
          'AuthGate',
          Date.now() - startTime
        );
      }

      return GateResult.success(authContext, Date.now() - startTime);

    } catch (error) {
      return GateResult.failure(
        'AUTH_INTERNAL_ERROR',
        'Internal authentication error',
        500,
        'AuthGate',
        Date.now() - startTime
      );
    }
  }

  private extractBearerToken(request: FastifyRequest): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  private validateScopes(
    userScopes: string[], 
    userRoles: string[], 
    requiredScopes: SecurityScope[]
  ): { isValid: boolean; missingScope?: string } {
    
    for (const required of requiredScopes) {
      const scopeString = `${required.resource}:${required.action}`;
      
      // Check direct scope
      if (userScopes.includes(scopeString)) {
        continue;
      }
      
      // Check wildcard scopes
      if (userScopes.includes(`${required.resource}:*`) || 
          userScopes.includes('*:*')) {
        continue;
      }
      
      // Check admin override
      if (required.constraints?.adminOnly && userRoles.includes('admin')) {
        continue;
      }
      
      // Scope not found
      return { 
        isValid: false, 
        missingScope: scopeString 
      };
    }
    
    return { isValid: true };
  }
}

// Common scope definitions
export const UserScopes = {
  CREATE: { resource: 'users', action: 'create' },
  READ: { resource: 'users', action: 'read' },
  UPDATE: { resource: 'users', action: 'update' },
  DELETE: { resource: 'users', action: 'delete' },
} as const;