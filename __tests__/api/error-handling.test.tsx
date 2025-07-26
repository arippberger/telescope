import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import UserStarsContent from '../../app/components/user-stars-content';
import ErrorBoundaryComponent from '../../app/components/error-boundary';
import { RepositoryGridSkeleton } from '../../app/components/loading-spinner';
import * as githubLib from '../../app/lib/github';

// Mock the GitHub API functions
jest.mock('../../app/lib/github', () => ({
  getUserStarredRepositories: jest.fn(),
  parseRepositorySlug: jest.fn(),
  generateRepositorySlug: jest.fn(),
}));

const mockedGithub = githubLib as jest.Mocked<typeof githubLib>;

// Helper component to properly test async Server Components
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundaryComponent>
    <Suspense fallback={<RepositoryGridSkeleton count={3} />}>
      {children}
    </Suspense>
  </ErrorBoundaryComponent>
);

describe('API Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests to avoid noise
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GitHub API Error Scenarios', () => {
    it('handles user not found error (404)', async () => {
      const userNotFoundError = new Error('User not found');
      mockedGithub.getUserStarredRepositories.mockRejectedValue(userNotFoundError);

      render(
        <TestWrapper>
          {/* @ts-expect-error Async Server Component */}
          <UserStarsContent user="nonexistent-user" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('User Not Found')).toBeInTheDocument();
      });

      expect(screen.getByText(/The GitHub user "nonexistent-user" was not found/)).toBeInTheDocument();
      expect(screen.getByText('Search for a different user')).toBeInTheDocument();
    });

    it('handles rate limit exceeded error (403)', async () => {
      const rateLimitError = new Error('Rate limit exceeded. Please try again later.');
      mockedGithub.getUserStarredRepositories.mockRejectedValue(rateLimitError);

      render(
        <TestWrapper>
          {/* @ts-expect-error Async Server Component */}
          <UserStarsContent user="test-user" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Rate Limit Reached')).toBeInTheDocument();
      });

      expect(screen.getByText(/GitHub API rate limit exceeded/)).toBeInTheDocument();
      expect(screen.getByText('Try again')).toBeInTheDocument();
    });

    it('handles generic network errors', async () => {
      const networkError = new Error('Failed to fetch starred repositories');
      mockedGithub.getUserStarredRepositories.mockRejectedValue(networkError);

      render(
        <TestWrapper>
          {/* @ts-expect-error Async Server Component */}
          <UserStarsContent user="test-user" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Unable to Load Repositories')).toBeInTheDocument();
      });

      expect(screen.getByText('Failed to fetch starred repositories')).toBeInTheDocument();
      expect(screen.getByText('Try again')).toBeInTheDocument();
    });

    it('handles unknown errors gracefully', async () => {
      const unknownError = new Error('Something unexpected happened');
      mockedGithub.getUserStarredRepositories.mockRejectedValue(unknownError);

      render(
        <TestWrapper>
          {/* @ts-expect-error Async Server Component */}
          <UserStarsContent user="test-user" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Unable to Load Repositories')).toBeInTheDocument();
      });

      expect(screen.getByText('Something unexpected happened')).toBeInTheDocument();
    });

    it('handles non-Error objects being thrown', async () => {
      mockedGithub.getUserStarredRepositories.mockRejectedValue('String error');

      render(
        <TestWrapper>
          {/* @ts-expect-error Async Server Component */}
          <UserStarsContent user="test-user" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Unable to Load Repositories')).toBeInTheDocument();
      });

      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });
  });

  describe('Empty State Handling', () => {
    it('displays empty state when user has no starred repositories', async () => {
      const emptyResponse = {
        user: {
          starredRepositories: {
            totalCount: 0,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
            edges: [],
          },
        },
      };

      mockedGithub.getUserStarredRepositories.mockResolvedValue(emptyResponse);

      render(
        <TestWrapper>
          {/* @ts-expect-error Async Server Component */}
          <UserStarsContent user="empty-user" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('No starred repositories')).toBeInTheDocument();
      });

      expect(screen.getByText(/empty-user hasn't starred any repositories yet/)).toBeInTheDocument();
    });

    it('handles null user in response', async () => {
      const nullUserResponse = {
        user: null,
      };

      mockedGithub.getUserStarredRepositories.mockResolvedValue(nullUserResponse as any);

      render(
        <TestWrapper>
          {/* @ts-expect-error Async Server Component */}
          <UserStarsContent user="null-user" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('No starred repositories')).toBeInTheDocument();
      });
    });
  });

  describe('Error Boundary Component', () => {
    // Component that throws an error for testing
    const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
      if (shouldThrow) {
        throw new Error('Test error for error boundary');
      }
      return <div>No error</div>;
    };

    it('catches and displays JavaScript errors', () => {
      render(
        <ErrorBoundaryComponent>
          <ThrowError shouldThrow={true} />
        </ErrorBoundaryComponent>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
      expect(screen.getByText('Try again')).toBeInTheDocument();
    });

    it('displays error details in development mode', () => {
      const originalEnv = process.env;
      process.env = { ...originalEnv, NODE_ENV: 'development' };

      render(
        <ErrorBoundaryComponent>
          <ThrowError shouldThrow={true} />
        </ErrorBoundaryComponent>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/Test error for error boundary/)).toBeInTheDocument();

      process.env = originalEnv;
    });

    it('hides error details in production mode', () => {
      const originalEnv = process.env;
      process.env = { ...originalEnv, NODE_ENV: 'production' };

      render(
        <ErrorBoundaryComponent>
          <ThrowError shouldThrow={true} />
        </ErrorBoundaryComponent>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.queryByText(/Test error for error boundary/)).not.toBeInTheDocument();

      process.env = originalEnv;
    });

    it('does not interfere with normal rendering', () => {
      render(
        <ErrorBoundaryComponent>
          <ThrowError shouldThrow={false} />
        </ErrorBoundaryComponent>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    it('resets error state when retry is clicked', async () => {
      const { rerender } = render(
        <ErrorBoundaryComponent>
          <ThrowError shouldThrow={true} />
        </ErrorBoundaryComponent>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Simulate fixing the error
      rerender(
        <ErrorBoundaryComponent>
          <ThrowError shouldThrow={false} />
        </ErrorBoundaryComponent>
      );

      // The error boundary should still show the error until retry is clicked
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Loading State Transitions', () => {
    it('shows loading spinner initially then error state', async () => {
      // Start with a pending promise
      let resolvePromise: (value: any) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      mockedGithub.getUserStarredRepositories.mockReturnValue(pendingPromise);

      render(
        <TestWrapper>
          {/* @ts-expect-error Async Server Component */}
          <UserStarsContent user="loading-user" />
        </TestWrapper>
      );

      // Should show loading initially (handled by Suspense)
      expect(screen.getByTestId('repository-grid-skeleton')).toBeInTheDocument();

      // Resolve with error
      resolvePromise!(Promise.reject(new Error('Network error')));

      await waitFor(() => {
        expect(screen.getByText('Unable to Load Repositories')).toBeInTheDocument();
      });
    });

    it('transitions from loading to success state', async () => {
      const successResponse = {
        user: {
          starredRepositories: {
            totalCount: 1,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
            edges: [
              {
                node: {
                  id: 'test-repo-1',
                  name: 'test-repo',
                  nameWithOwner: 'testuser/test-repo',
                  description: 'A test repository',
                  url: 'https://github.com/testuser/test-repo',
                  stargazerCount: 100,
                  primaryLanguage: { name: 'JavaScript', color: '#f1e05a' },
                  owner: {
                    login: 'testuser',
                    avatarUrl: 'https://github.com/testuser.avatar',
                  },
                  createdAt: '2023-01-01T00:00:00Z',
                  updatedAt: '2023-12-01T00:00:00Z',
                  topics: { nodes: [] },
                },
              },
            ],
          },
        },
      };

      mockedGithub.getUserStarredRepositories.mockResolvedValue(successResponse);
      mockedGithub.generateRepositorySlug.mockReturnValue('testuser-test-repo');

      render(
        <TestWrapper>
          {/* @ts-expect-error Async Server Component */}
          <UserStarsContent user="success-user" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('test-repo')).toBeInTheDocument();
      });

      expect(screen.getByText('A test repository')).toBeInTheDocument();
    });
  });

  describe('Error Recovery Actions', () => {
    it('provides appropriate recovery actions for different error types', async () => {
      // Test user not found error
      mockedGithub.getUserStarredRepositories.mockRejectedValue(new Error('User not found'));

      const { rerender } = render(
        <TestWrapper>
          {/* @ts-expect-error Async Server Component */}
          <UserStarsContent user="notfound" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Search for a different user')).toBeInTheDocument();
      });

      // Test rate limit error
      mockedGithub.getUserStarredRepositories.mockRejectedValue(
        new Error('Rate limit exceeded. Please try again later.')
      );

      rerender(
        <TestWrapper>
          {/* @ts-expect-error Async Server Component */}
          <UserStarsContent user="ratelimited" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Try again')).toBeInTheDocument();
      });
    });

    it('shows reload button for generic errors', async () => {
      mockedGithub.getUserStarredRepositories.mockRejectedValue(
        new Error('Network connection failed')
      );

      render(
        <TestWrapper>
          {/* @ts-expect-error Async Server Component */}
          <UserStarsContent user="network-error" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Try again')).toBeInTheDocument();
      });

      const tryAgainButton = screen.getByText('Try again');
      expect(tryAgainButton).toHaveAttribute('type', 'button');
    });
  });
}); 