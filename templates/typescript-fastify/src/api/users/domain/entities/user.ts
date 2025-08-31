/**
 * BRIK v5 User Domain Entity
 * Pure domain logic with invariants
 */

import { Result, ok, err } from '@/shared/types/result.js';
import { UserId } from '../value-objects/user-id.js';
import { Email } from '../value-objects/email.js';
import { DomainError } from '../errors/domain-errors.js';

export interface UserProfile {
  bio?: string;
  website?: string;
  avatarUrl?: string;
}

export interface UserCreationData {
  email: string;
  name: string;
  age: number;
  profile?: UserProfile;
}

export interface UserUpdateData {
  name?: string;
  age?: number;
  profile?: UserProfile;
}

export class User {
  private constructor(
    public readonly id: UserId,
    public readonly email: Email,
    public readonly name: string,
    public readonly age: number,
    public readonly profile: UserProfile,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly version: number
  ) {
    // Invariants are enforced in factory methods
  }

  /**
   * Factory method for creating a new user
   */
  static create(data: UserCreationData): Result<User, DomainError> {
    // Validate name
    const nameValidation = this.validateName(data.name);
    if (nameValidation.isErr()) {
      return nameValidation;
    }

    // Validate age
    const ageValidation = this.validateAge(data.age);
    if (ageValidation.isErr()) {
      return ageValidation;
    }

    // Create value objects
    const userIdResult = UserId.generate();
    if (userIdResult.isErr()) {
      return err(userIdResult.unwrapErr());
    }

    const emailResult = Email.create(data.email);
    if (emailResult.isErr()) {
      return err(emailResult.unwrapErr());
    }

    // Validate profile if provided
    if (data.profile) {
      const profileValidation = this.validateProfile(data.profile);
      if (profileValidation.isErr()) {
        return profileValidation;
      }
    }

    const now = new Date();

    return ok(new User(
      userIdResult.unwrap(),
      emailResult.unwrap(),
      data.name.trim(),
      data.age,
      data.profile || {},
      now,
      now,
      1
    ));
  }

  /**
   * Factory method for reconstructing user from persistence
   */
  static fromPersistence(data: {
    id: string;
    email: string;
    name: string;
    age: number;
    profile: UserProfile;
    createdAt: Date;
    updatedAt: Date;
    version: number;
  }): Result<User, DomainError> {
    const userIdResult = UserId.fromString(data.id);
    if (userIdResult.isErr()) {
      return err(userIdResult.unwrapErr());
    }

    const emailResult = Email.create(data.email);
    if (emailResult.isErr()) {
      return err(emailResult.unwrapErr());
    }

    return ok(new User(
      userIdResult.unwrap(),
      emailResult.unwrap(),
      data.name,
      data.age,
      data.profile,
      data.createdAt,
      data.updatedAt,
      data.version
    ));
  }

  /**
   * Update user with new data
   */
  update(data: UserUpdateData): Result<User, DomainError> {
    let updatedName = this.name;
    let updatedAge = this.age;
    let updatedProfile = this.profile;

    // Validate and update name if provided
    if (data.name !== undefined) {
      const nameValidation = User.validateName(data.name);
      if (nameValidation.isErr()) {
        return nameValidation;
      }
      updatedName = data.name.trim();
    }

    // Validate and update age if provided
    if (data.age !== undefined) {
      const ageValidation = User.validateAge(data.age);
      if (ageValidation.isErr()) {
        return ageValidation;
      }
      updatedAge = data.age;
    }

    // Validate and update profile if provided
    if (data.profile !== undefined) {
      const profileValidation = User.validateProfile(data.profile);
      if (profileValidation.isErr()) {
        return profileValidation;
      }
      updatedProfile = { ...this.profile, ...data.profile };
    }

    return ok(new User(
      this.id,
      this.email,
      updatedName,
      updatedAge,
      updatedProfile,
      this.createdAt,
      new Date(),
      this.version + 1
    ));
  }

  /**
   * Check if user can be deleted
   */
  canBeDeleted(): Result<boolean, DomainError> {
    // Business rule: Users created less than 1 hour ago cannot be deleted
    // (to prevent accidental deletions)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    if (this.createdAt > oneHourAgo) {
      return err(new DomainError(
        'USER_DELETION_TOO_EARLY',
        'Users cannot be deleted within 1 hour of creation',
        422
      ));
    }

    return ok(true);
  }

  /**
   * Get user's public profile (for external consumption)
   */
  getPublicProfile(): {
    id: string;
    name: string;
    profile: UserProfile;
    createdAt: Date;
  } {
    return {
      id: this.id.toString(),
      name: this.name,
      profile: this.profile,
      createdAt: this.createdAt
    };
  }

  /**
   * Get user's full data (for authenticated contexts)
   */
  toData(): {
    id: string;
    email: string;
    name: string;
    age: number;
    profile: UserProfile;
    createdAt: Date;
    updatedAt: Date;
    version: number;
  } {
    return {
      id: this.id.toString(),
      email: this.email.toString(),
      name: this.name,
      age: this.age,
      profile: this.profile,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version
    };
  }

  // Validation methods
  private static validateName(name: string): Result<string, DomainError> {
    if (!name || typeof name !== 'string') {
      return err(new DomainError(
        'INVALID_USER_NAME',
        'Name is required and must be a string',
        400
      ));
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return err(new DomainError(
        'INVALID_USER_NAME',
        'Name must be at least 2 characters long',
        400
      ));
    }

    if (trimmedName.length > 100) {
      return err(new DomainError(
        'INVALID_USER_NAME',
        'Name must not exceed 100 characters',
        400
      ));
    }

    // Basic sanitization - no control characters
    if (!/^[\p{L}\p{M}\p{N}\p{P}\p{S}\p{Zs}]*$/u.test(trimmedName)) {
      return err(new DomainError(
        'INVALID_USER_NAME',
        'Name contains invalid characters',
        400
      ));
    }

    return ok(trimmedName);
  }

  private static validateAge(age: number): Result<number, DomainError> {
    if (typeof age !== 'number' || !Number.isInteger(age)) {
      return err(new DomainError(
        'INVALID_USER_AGE',
        'Age must be a valid integer',
        400
      ));
    }

    if (age < 13) {
      return err(new DomainError(
        'INVALID_USER_AGE',
        'Users must be at least 13 years old (COPPA compliance)',
        400
      ));
    }

    if (age > 150) {
      return err(new DomainError(
        'INVALID_USER_AGE',
        'Age must be realistic (maximum 150 years)',
        400
      ));
    }

    return ok(age);
  }

  private static validateProfile(profile: UserProfile): Result<UserProfile, DomainError> {
    if (profile.bio && profile.bio.length > 500) {
      return err(new DomainError(
        'INVALID_USER_PROFILE',
        'Bio must not exceed 500 characters',
        400
      ));
    }

    if (profile.website) {
      try {
        new URL(profile.website);
      } catch {
        return err(new DomainError(
          'INVALID_USER_PROFILE',
          'Website must be a valid URL',
          400
        ));
      }
    }

    if (profile.avatarUrl) {
      try {
        const url = new URL(profile.avatarUrl);
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('Invalid protocol');
        }
      } catch {
        return err(new DomainError(
          'INVALID_USER_PROFILE',
          'Avatar URL must be a valid HTTP/HTTPS URL',
          400
        ));
      }
    }

    return ok(profile);
  }
}