import { GitHubRepository } from './github-api';

// Re-export the comprehensive GitHub repository type for backward compatibility
export default interface RepoNode extends GitHubRepository {
  href: string; // Additional property used in UI components
}
