/**
 * BRIK v5 Structured Logger with Correlation ID support
 */

import pino, { Logger as PinoLogger } from 'pino';

export interface LogContext {
  correlationId?: string;
  userId?: string;
  endpoint?: string;
  gate?: string;
  port?: string;
  duration?: number;
  [key: string]: unknown;
}

export interface BrikLogger {
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  child(context: LogContext): BrikLogger;
}

class PinoBrikLogger implements BrikLogger {
  constructor(private readonly logger: PinoLogger) {}

  info(message: string, context?: LogContext): void {
    this.logger.info(context, message);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(context, message);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    };
    this.logger.error(errorContext, message);
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(context, message);
  }

  child(context: LogContext): BrikLogger {
    return new PinoBrikLogger(this.logger.child(context));
  }
}

export class LoggerFactory {
  private static instance: BrikLogger;

  static getInstance(): BrikLogger {
    if (!this.instance) {
      const pinoLogger = pino({
        level: process.env.LOG_LEVEL || 'info',
        ...(process.env.NODE_ENV === 'development' && {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'yyyy-mm-dd HH:MM:ss',
              ignore: 'pid,hostname',
            },
          },
        }),
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
        serializers: {
          error: pino.stdSerializers.err,
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      });

      this.instance = new PinoBrikLogger(pinoLogger);
    }

    return this.instance;
  }

  static createChild(context: LogContext): BrikLogger {
    return this.getInstance().child(context);
  }
}

export const logger = LoggerFactory.getInstance();