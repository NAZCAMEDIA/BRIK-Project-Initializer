/**
 * BRIK v5 Result Type - Functional error handling
 */

export abstract class Result<T, E extends Error> {
  abstract isOk(): this is Ok<T, E>;
  abstract isErr(): this is Err<T, E>;
  abstract unwrap(): T;
  abstract unwrapOr(defaultValue: T): T;
  abstract unwrapErr(): E;
  
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isOk()) {
      return Ok.of(fn(this.value));
    }
    return Err.of(this.error);
  }
  
  mapErr<F extends Error>(fn: (error: E) => F): Result<T, F> {
    if (this.isErr()) {
      return Err.of(fn(this.error));
    }
    return Ok.of(this.value);
  }
  
  and<U>(other: Result<U, E>): Result<U, E> {
    if (this.isOk()) {
      return other;
    }
    return Err.of(this.error);
  }
  
  or(other: Result<T, E>): Result<T, E> {
    if (this.isOk()) {
      return this;
    }
    return other;
  }
  
  static ok<T, E extends Error>(value: T): Result<T, E> {
    return Ok.of(value);
  }
  
  static err<T, E extends Error>(error: E): Result<T, E> {
    return Err.of(error);
  }
}

export class Ok<T, E extends Error> extends Result<T, E> {
  constructor(public readonly value: T) {
    super();
  }
  
  isOk(): this is Ok<T, E> {
    return true;
  }
  
  isErr(): this is Err<T, E> {
    return false;
  }
  
  unwrap(): T {
    return this.value;
  }
  
  unwrapOr(_defaultValue: T): T {
    return this.value;
  }
  
  unwrapErr(): E {
    throw new Error('Called unwrapErr on Ok result');
  }
  
  static of<T, E extends Error>(value: T): Ok<T, E> {
    return new Ok(value);
  }
}

export class Err<T, E extends Error> extends Result<T, E> {
  constructor(public readonly error: E) {
    super();
  }
  
  isOk(): this is Ok<T, E> {
    return false;
  }
  
  isErr(): this is Err<T, E> {
    return true;
  }
  
  unwrap(): T {
    throw this.error;
  }
  
  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }
  
  unwrapErr(): E {
    return this.error;
  }
  
  static of<T, E extends Error>(error: E): Err<T, E> {
    return new Err(error);
  }
}

// Utility functions
export const ok = Result.ok;
export const err = Result.err;