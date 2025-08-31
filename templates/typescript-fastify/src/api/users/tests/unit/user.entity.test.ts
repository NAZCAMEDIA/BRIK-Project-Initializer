/**
 * BRIK v5 Unit Tests - User Entity
 */

import { User, UserCreationData, UserUpdateData } from '../../domain/entities/user.js';
import { DomainError } from '../../domain/errors/domain-errors.js';

describe('User Entity', () => {
  const validUserData: UserCreationData = {
    email: 'john.doe@example.com',
    name: 'John Doe',
    age: 30,
    profile: {
      bio: 'Software developer',
      website: 'https://johndoe.com'
    }
  };

  describe('create', () => {
    it('should create a valid user with all required fields', () => {
      const result = User.create(validUserData);

      expect(result.isOk()).toBe(true);
      
      const user = result.unwrap();
      expect(user.email.toString()).toBe('john.doe@example.com');
      expect(user.name).toBe('John Doe');
      expect(user.age).toBe(30);
      expect(user.profile.bio).toBe('Software developer');
      expect(user.version).toBe(1);
      expect(user.id.toString()).toMatch(/^[0-9a-f-]{36}$/);
    });

    it('should create a user without optional profile', () => {
      const dataWithoutProfile = { ...validUserData };
      delete dataWithoutProfile.profile;

      const result = User.create(dataWithoutProfile);

      expect(result.isOk()).toBe(true);
      
      const user = result.unwrap();
      expect(user.profile).toEqual({});
    });

    it('should fail with invalid email', () => {
      const invalidData = { ...validUserData, email: 'invalid-email' };

      const result = User.create(invalidData);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(DomainError);
      expect(result.unwrapErr().code).toBe('INVALID_EMAIL');
    });

    it('should fail with empty name', () => {
      const invalidData = { ...validUserData, name: '' };

      const result = User.create(invalidData);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().code).toBe('INVALID_USER_NAME');
    });

    it('should fail with name too short', () => {
      const invalidData = { ...validUserData, name: 'X' };

      const result = User.create(invalidData);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().code).toBe('INVALID_USER_NAME');
    });

    it('should fail with name too long', () => {
      const invalidData = { ...validUserData, name: 'X'.repeat(101) };

      const result = User.create(invalidData);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().code).toBe('INVALID_USER_NAME');
    });

    it('should fail with age below minimum (COPPA compliance)', () => {
      const invalidData = { ...validUserData, age: 12 };

      const result = User.create(invalidData);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().code).toBe('INVALID_USER_AGE');
      expect(result.unwrapErr().message).toContain('COPPA compliance');
    });

    it('should fail with unrealistic age', () => {
      const invalidData = { ...validUserData, age: 200 };

      const result = User.create(invalidData);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().code).toBe('INVALID_USER_AGE');
    });

    it('should fail with bio too long', () => {
      const invalidData = {
        ...validUserData,
        profile: {
          bio: 'X'.repeat(501)
        }
      };

      const result = User.create(invalidData);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().code).toBe('INVALID_USER_PROFILE');
    });

    it('should fail with invalid website URL', () => {
      const invalidData = {
        ...validUserData,
        profile: {
          website: 'not-a-url'
        }
      };

      const result = User.create(invalidData);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().code).toBe('INVALID_USER_PROFILE');
    });

    it('should trim whitespace from name', () => {
      const dataWithWhitespace = { ...validUserData, name: '  John Doe  ' };

      const result = User.create(dataWithWhitespace);

      expect(result.isOk()).toBe(true);
      expect(result.unwrap().name).toBe('John Doe');
    });
  });

  describe('update', () => {
    let user: User;

    beforeEach(() => {
      user = User.create(validUserData).unwrap();
    });

    it('should update user name', () => {
      const updateData: UserUpdateData = { name: 'Jane Doe' };

      const result = user.update(updateData);

      expect(result.isOk()).toBe(true);
      
      const updatedUser = result.unwrap();
      expect(updatedUser.name).toBe('Jane Doe');
      expect(updatedUser.version).toBe(2);
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(user.updatedAt.getTime());
    });

    it('should update user age', () => {
      const updateData: UserUpdateData = { age: 31 };

      const result = user.update(updateData);

      expect(result.isOk()).toBe(true);
      expect(result.unwrap().age).toBe(31);
    });

    it('should update user profile', () => {
      const updateData: UserUpdateData = {
        profile: {
          bio: 'Updated bio',
          website: 'https://updated.com'
        }
      };

      const result = user.update(updateData);

      expect(result.isOk()).toBe(true);
      
      const updatedUser = result.unwrap();
      expect(updatedUser.profile.bio).toBe('Updated bio');
      expect(updatedUser.profile.website).toBe('https://updated.com');
    });

    it('should merge profile updates with existing profile', () => {
      const updateData: UserUpdateData = {
        profile: {
          bio: 'New bio'
          // website should remain unchanged
        }
      };

      const result = user.update(updateData);

      expect(result.isOk()).toBe(true);
      
      const updatedUser = result.unwrap();
      expect(updatedUser.profile.bio).toBe('New bio');
      expect(updatedUser.profile.website).toBe('https://johndoe.com'); // Original value
    });

    it('should fail with invalid name', () => {
      const updateData: UserUpdateData = { name: '' };

      const result = user.update(updateData);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().code).toBe('INVALID_USER_NAME');
    });

    it('should fail with invalid age', () => {
      const updateData: UserUpdateData = { age: 12 };

      const result = user.update(updateData);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().code).toBe('INVALID_USER_AGE');
    });

    it('should not change original user when update fails', () => {
      const originalName = user.name;
      const originalVersion = user.version;
      
      const updateData: UserUpdateData = { name: '' };
      const result = user.update(updateData);

      expect(result.isErr()).toBe(true);
      expect(user.name).toBe(originalName);
      expect(user.version).toBe(originalVersion);
    });
  });

  describe('canBeDeleted', () => {
    it('should allow deletion of user created more than 1 hour ago', () => {
      const oldDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      
      const userData = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        age: 30,
        profile: {},
        createdAt: oldDate,
        updatedAt: oldDate,
        version: 1
      };

      const user = User.fromPersistence(userData).unwrap();
      const result = user.canBeDeleted();

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe(true);
    });

    it('should prevent deletion of recently created user', () => {
      // User created just now
      const result = User.create(validUserData).unwrap().canBeDeleted();

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().code).toBe('USER_DELETION_TOO_EARLY');
    });
  });

  describe('getPublicProfile', () => {
    it('should return public profile without sensitive data', () => {
      const user = User.create(validUserData).unwrap();
      const publicProfile = user.getPublicProfile();

      expect(publicProfile).toHaveProperty('id');
      expect(publicProfile).toHaveProperty('name');
      expect(publicProfile).toHaveProperty('profile');
      expect(publicProfile).toHaveProperty('createdAt');
      
      // Should not have sensitive data
      expect(publicProfile).not.toHaveProperty('email');
      expect(publicProfile).not.toHaveProperty('age');
      expect(publicProfile).not.toHaveProperty('version');
    });
  });

  describe('toData', () => {
    it('should return complete user data', () => {
      const user = User.create(validUserData).unwrap();
      const userData = user.toData();

      expect(userData).toHaveProperty('id');
      expect(userData).toHaveProperty('email');
      expect(userData).toHaveProperty('name');
      expect(userData).toHaveProperty('age');
      expect(userData).toHaveProperty('profile');
      expect(userData).toHaveProperty('createdAt');
      expect(userData).toHaveProperty('updatedAt');
      expect(userData).toHaveProperty('version');
    });
  });

  describe('fromPersistence', () => {
    it('should reconstruct user from persistence data', () => {
      const persistenceData = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
        profile: { bio: 'Test bio' },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        version: 3
      };

      const result = User.fromPersistence(persistenceData);

      expect(result.isOk()).toBe(true);
      
      const user = result.unwrap();
      expect(user.id.toString()).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(user.email.toString()).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.age).toBe(25);
      expect(user.version).toBe(3);
    });

    it('should fail with invalid persistence data', () => {
      const invalidData = {
        id: 'invalid-uuid',
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
        profile: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      };

      const result = User.fromPersistence(invalidData);

      expect(result.isErr()).toBe(true);
    });
  });
});