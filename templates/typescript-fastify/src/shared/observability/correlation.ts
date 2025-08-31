/**
 * BRIK v5 Correlation ID Management
 */

import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';

export interface RequestContext {
  correlationId: string;
  traceId: string;
  userId?: string;
  requestStart: Date;
  endpoint?: string;
}

class CorrelationManager {
  private storage = new AsyncLocalStorage<RequestContext>();

  getContext(): RequestContext | undefined {
    return this.storage.getStore();
  }

  getCorrelationId(): string | undefined {
    return this.getContext()?.correlationId;
  }

  getTraceId(): string | undefined {
    return this.getContext()?.traceId;
  }

  getUserId(): string | undefined {
    return this.getContext()?.userId;
  }

  run<T>(context: RequestContext, callback: () => T): T {
    return this.storage.run(context, callback);
  }

  runWithNewContext<T>(
    correlationId?: string,
    endpoint?: string,
    userId?: string,
    callback?: () => T
  ): T | undefined {
    const context: RequestContext = {
      correlationId: correlationId || this.generateCorrelationId(),
      traceId: this.generateTraceId(),
      userId,
      requestStart: new Date(),
      endpoint,
    };

    if (callback) {
      return this.storage.run(context, callback);
    }

    return undefined;
  }

  private generateCorrelationId(): string {
    return `req_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
  }

  private generateTraceId(): string {
    return `trace_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
  }
}

export const correlationManager = new CorrelationManager();