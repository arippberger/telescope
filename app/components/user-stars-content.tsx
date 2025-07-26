import Stars from "./stars";
import Pagination from "./pagination";
import { getUserStarredRepositories } from "../lib/github";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface Props {
  user: string;
  cursor?: string;
}

function ErrorDisplay({ message, user }: { message: string; user: string }) {
  const isUserNotFound = message.includes('User not found');
  const isRateLimit = message.includes('Rate limit exceeded');
  
  return (
    <div className="min-h-[300px] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {isUserNotFound ? 'User Not Found' : 
           isRateLimit ? 'Rate Limit Reached' : 
           'Unable to Load Repositories'}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {isUserNotFound 
            ? `The GitHub user "${user}" was not found. Please check the username and try again.`
            : isRateLimit
            ? 'GitHub API rate limit exceeded. Please wait a moment before trying again.'
            : message}
        </p>
        <div className="mt-6">
          {isUserNotFound ? (
            <a
              href="/"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Search for a different user
            </a>
          ) : (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function UserStarsContent({ user, cursor }: Props) {
  try {
    const data = await getUserStarredRepositories(user, cursor);
    
    // Check if user exists but has no starred repositories
    if (data.user && data.user.starredRepositories.totalCount === 0) {
      return (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No starred repositories</h3>
                         <p className="mt-2 text-sm text-gray-600">
               {user} hasn&apos;t starred any repositories yet.
             </p>
          </div>
        </div>
      );
    }
    
    return (
      <>
        <Stars searchValue={user} stars={data} />
        <div className="container mx-auto">
          <Pagination
            user={user}
            nextPageCursor={data.user?.starredRepositories?.pageInfo?.hasNextPage 
              ? data.user.starredRepositories.pageInfo.endCursor 
              : null}
            previousPageCursor={data.user?.starredRepositories?.pageInfo?.hasPreviousPage 
              ? data.user.starredRepositories.pageInfo.startCursor 
              : null}
            hasNextPage={data.user?.starredRepositories?.pageInfo?.hasNextPage || false}
            hasPreviousPage={data.user?.starredRepositories?.pageInfo?.hasPreviousPage || false}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching starred repositories:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return <ErrorDisplay message={errorMessage} user={user} />;
  }
} 