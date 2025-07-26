import { UserStarredRepositoriesResponse } from './github-api';

// Re-export the comprehensive type for backward compatibility
export default interface Stars extends UserStarredRepositoriesResponse {}
