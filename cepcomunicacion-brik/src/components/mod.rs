// 🔧 BRIK WRAPPERS Module Index (TypeScript)
// Configurable layer - External service integrations and repositories
// Generated automatically - DO NOT modify

export * from './sqliteintegration_integration';
export * from './frontendrepository_repository';

// Wrapper layer exports (configurable)
export interface BrikWrappers {
  // Integrations
    SQLiteIntegrationIntegration: typeof SQLiteIntegrationIntegration;
  
  // Repositories
    FrontendRepositoryRepository: typeof FrontendRepositoryRepository;
}

// BRIK Wrappers initialization
export const initializeWrappers = (): BrikWrappers => {
  return {
    SQLiteIntegrationIntegration,
    FrontendRepositoryRepository,
  };
};