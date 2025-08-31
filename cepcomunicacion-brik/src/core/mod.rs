// 🎯 BRIK CORE Module Index (TypeScript)
// Immutable layer - Central business logic and entities
// Generated automatically - DO NOT modify

export * from './business_rules';
export * from './frontend';

// Core layer exports (immutable)
export interface BrikCore {
  // Entities
    Frontend: typeof Frontend;
  
  // Business Rules
    EntityValidationRule: any;
}

// BRIK Core initialization
export const initializeCore = (): BrikCore => {
  return {
    Frontend,
    EntityValidationRule: {},
  };
};