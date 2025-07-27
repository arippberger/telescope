// GitHub GraphQL API Response Types

export interface GitHubUser {
  id: string;
  login: string;
  name: string | null;
  avatarUrl: string;
  url: string;
}

export interface GitHubOrganization {
  id: string;
  name: string;
  avatarUrl: string;
  url: string;
}

export interface Language {
  id: string;
  name: string;
  color: string;
}

export interface LanguageEdge {
  node: Language;
}

export interface LanguageConnection {
  edges: LanguageEdge[];
}

export interface Topic {
  id: string;
  name: string;
  stargazerCount: number;
}

export interface TopicNode {
  url: string;
  topic: Topic;
}

export interface TopicConnection {
  nodes: TopicNode[];
}

export interface Stargazer {
  id: string;
  name: string | null;
  avatarUrl: string;
  url: string;
}

export interface StargazerConnection {
  nodes: Stargazer[];
}

export interface Release {
  name: string | null;
  tag: {
    name: string;
  } | null;
}

export interface ReleaseConnection {
  nodes: Release[];
}

export interface CommitAuthor {
  login: string;
  avatarUrl: string;
  url: string;
}

export interface Commit {
  id: string;
  bodyText: string;
  url: string;
  author: CommitAuthor | null;
  commit: {
    message: string;
  };
}

export interface CommitCommentConnection {
  nodes: Commit[];
}

export interface LicenseInfo {
  name: string;
  description: string;
  url: string;
}

export interface WatcherConnection {
  totalCount: number;
}

export interface GitHubRepository {
  id: string;
  name: string;
  nameWithOwner: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  forkCount: number;
  isPrivate: boolean;
  pushedAt: string;
  updatedAt: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'INTERNAL';
  openGraphImageUrl: string | null;
  usesCustomOpenGraphImage: boolean;
  owner: GitHubUser | GitHubOrganization;
  parent: {
    id: string;
    name: string;
    url: string;
  } | null;
  primaryLanguage: Language | null;
  languages: LanguageConnection;
  repositoryTopics: TopicConnection;
  stargazers: StargazerConnection;
  watchers: WatcherConnection;
  releases: ReleaseConnection;
  commitComments: CommitCommentConnection;
  licenseInfo: LicenseInfo | null;
}

export interface StarredRepositoryEdge {
  starredAt: string;
  node: GitHubRepository;
}

export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface StarredRepositoryConnection {
  totalCount: number;
  edges: StarredRepositoryEdge[];
  pageInfo: PageInfo;
}

export interface GitHubUserWithStars {
  starredRepositories: StarredRepositoryConnection;
}

// Main API Response Types
export interface UserStarredRepositoriesResponse {
  user: GitHubUserWithStars | null;
}

export interface RepositoryResponse {
  repository: GitHubRepository | null;
}

// Extended types for UI components
export interface RepositoryWithSlug extends GitHubRepository {
  slug: string;
  initials: string;
}

export interface RepositoryWithUIProps extends RepositoryWithSlug {
  href: string;
} 