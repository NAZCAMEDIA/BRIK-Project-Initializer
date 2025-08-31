/**
 * BRIK v5 Gate Result Type
 */

export class GateResult<T = any> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly data?: T,
    public readonly error?: GateError,
    public readonly durationMs?: number
  ) {}

  static success<T>(data?: T, durationMs?: number): GateResult<T> {
    return new GateResult(true, data, undefined, durationMs);
  }

  static failure<T>(
    code: string, 
    message: string, 
    httpStatus: number = 400, 
    gate?: string,
    durationMs?: number
  ): GateResult<T> {
    return new GateResult(
      false, 
      undefined, 
      new GateError(gate || 'UNKNOWN', code, httpStatus, message),
      durationMs
    );
  }

  unwrap(): T {
    if (!this.isSuccess || !this.data) {
      throw this.error || new Error('Gate result has no data');
    }
    return this.data;
  }

  unwrapOr(defaultValue: T): T {
    return this.isSuccess && this.data ? this.data : defaultValue;
  }
}

export class GateError extends Error {
  constructor(
    public readonly gate: string,
    public readonly code: string,
    public readonly httpStatus: number,
    message: string
  ) {
    super(message);
    this.name = 'GateError';
  }
}

export interface RequestGate<TInput = any, TOutput = any> {
  readonly name: string;
  validate(input: TInput): Promise<GateResult<TOutput>>;
}