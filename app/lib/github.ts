import { gql, request } from 'graphql-request';

const GITHUB_API_ENDPOINT = 'https://api.github.com/graphql';

// Ensure the GitHub token is available
const getGitHubToken = () => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }
  return token;
};

export const USER_STARRED_REPOSITORIES_QUERY = gql`
  query ($username: String!, $cursor: String) {
    user(login: $username) {
      starredRepositories(
        first: 12
        after: $cursor
        orderBy: { direction: DESC, field: STARRED_AT }
      ) {
        totalCount
        edges {
          starredAt
          node {
            name
            nameWithOwner
            description
            url
            stargazerCount
            forkCount
            isPrivate
            pushedAt
            updatedAt
            languages(first: 1, orderBy: { field: SIZE, direction: DESC }) {
              edges {
                node {
                  id
                  name
                  color
                }
              }
            }
            repositoryTopics(first: 10) {
              nodes {
                topic {
                  name
                  stargazerCount
                }
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

export const STARRED_REPOSITORY_QUERY = gql`
  query ($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      collaborators {
        nodes {
          avatarUrl
          id
          name
          url
        }
      }
      description
      forkCount
      id
      homepageUrl
      name
      owner {
        avatarUrl
        id
        url
        ... on Organization {
          name
        }
        ... on User {
          avatarUrl
          id
          url
          name
        }
      }
      parent {
        id
        name
        url
      }
      primaryLanguage {
        color
        id
        name
      }
      stargazerCount
      stargazers(first: 10) {
        nodes {
          avatarUrl
          id
          name
          url
        }
      }
      updatedAt
      url
      openGraphImageUrl
      usesCustomOpenGraphImage
      watchers {
        totalCount
      }
      visibility
      languages(first: 10) {
        nodes {
          color
          id
          name
        }
      }
      releases(last: 1) {
        nodes {
          name
          tag {
            name
          }
        }
      }
      repositoryTopics(first: 10) {
        nodes {
          url
          topic {
            name
            id
          }
        }
      }
      commitComments(first: 10) {
        nodes {
          author {
            avatarUrl
            url
            login
          }
          id
          bodyText
          url
          commit {
            message
          }
        }
      }
      licenseInfo {
        name
        description
        url
      }
    }
  }
`;

export async function getUserStarredRepositories(username: string, cursor?: string) {
  try {
    const token = getGitHubToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const data = await request(
      GITHUB_API_ENDPOINT,
      USER_STARRED_REPOSITORIES_QUERY,
      { username, cursor },
      headers
    );

    return data;
  } catch (error: any) {
    console.error('GitHub API Error:', error);
    
    // Handle specific GitHub API errors
    if (error.response?.status === 404) {
      throw new Error('User not found');
    }
    
    if (error.response?.status === 403) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    throw new Error('Failed to fetch starred repositories');
  }
}

export async function getRepository(name: string, owner: string) {
  try {
    const token = getGitHubToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const data = await request(
      GITHUB_API_ENDPOINT,
      STARRED_REPOSITORY_QUERY,
      { name, owner },
      headers
    );

    return data;
  } catch (error: any) {
    console.error('GitHub API Error:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Repository not found');
    }
    
    if (error.response?.status === 403) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    throw new Error('Failed to fetch repository details');
  }
}

export function parseRepositorySlug(slug: string): { owner: string; name: string } {
  // Improved parsing to handle repository names with hyphens
  const parts = slug.split('-');
  if (parts.length < 2) {
    throw new Error('Invalid repository slug format');
  }
  
  const owner = parts[0];
  const name = parts.slice(1).join('-'); // Join remaining parts to handle repo names with hyphens
  
  return { owner, name };
} 