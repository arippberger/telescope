import Tabs from "../../../../components/tabs";
import Image from "next/image";
import Link from "next/link";
import { getRepository, parseRepositorySlug } from "../../../../lib/github";
import { RepositoryResponse } from "../../../../types/github-api";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ star: string; user: string }>;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function Page({ params }: PageProps) {
  const { star, user } = await params;

  try {
    const { owner, name } = parseRepositorySlug(star);
    const data = await getRepository(name, owner) as RepositoryResponse;
    const repo = data.repository;

    if (!repo) {
      notFound();
    }

    return (
      <>
        <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          {/* Product */}
          <div className="mb-10">
            <Link
              href={`/users/${user}`}
              className="text-sm font-semibold leading-7 text-indigo-600"
            >
              <span aria-hidden="true">&larr;</span> Back
            </Link>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <div className="aspect-h-1 aspect-w-1 w-full">
              <Image
                src={
                  repo.openGraphImageUrl ||
                  `https://github.com/${owner}/${name}/archive/refs/heads/main.zip`
                }
                alt={repo.name}
                className="h-full w-full rounded-lg border object-cover object-center sm:rounded-lg"
                width={600}
                height={600}
              />
            </div>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <div className="flex space-x-3">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {repo.name}
                </h1>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  {repo.visibility}
                </span>
              </div>

              <div className="mt-3">
                <h2 className="sr-only">Repository information</h2>
                <p className="text-3xl tracking-tight text-gray-900">
                  ⭐ {repo.stargazerCount.toLocaleString()} stars
                </p>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6 text-base text-gray-700">
                  <p>{repo.description || "No description available."}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center">
                <div className="flex items-center">
                  {repo.primaryLanguage && (
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: repo.primaryLanguage.color }}
                      />
                      <span className="text-sm text-gray-600">
                        {repo.primaryLanguage.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-4 border-l border-gray-300 pl-4">
                  <p className="text-sm text-gray-600">
                    Last updated {formatDate(repo.updatedAt)}
                  </p>
                </div>
              </div>

              {repo.homepageUrl && (
                <div className="mt-6">
                  <Link
                    href={repo.homepageUrl}
                    className="text-indigo-600 hover:text-indigo-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website →
                  </Link>
                </div>
              )}

              <div className="mt-10 flex sm:flex-col1">
                <Link
                  href={repo.url}
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </Link>
              </div>

              <section aria-labelledby="details-heading" className="mt-12">
                <h2
                  id="details-heading"
                  className="text-lg font-medium text-gray-900"
                >
                  Additional details
                </h2>

                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Repository Statistics</h3>
                    <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Stars</dt>
                        <dd className="text-sm text-gray-900">{repo.stargazerCount.toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Forks</dt>
                        <dd className="text-sm text-gray-900">{repo.forkCount.toLocaleString()}</dd>
                      </div>
                      {repo.watchers && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Watchers</dt>
                          <dd className="text-sm text-gray-900">{repo.watchers.totalCount.toLocaleString()}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Visibility</dt>
                        <dd className="text-sm text-gray-900">{repo.visibility}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error: unknown) {
    console.error('Error loading repository:', error);
    
    // Handle specific repository not found case
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('Repository not found') || 
        errorMessage.includes('Could not resolve') ||
        errorMessage.includes('not found')) {
      const { owner, name } = parseRepositorySlug(star);
      
      return (
        <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="mb-10">
            <Link
              href={`/users/${user}`}
              className="text-sm font-semibold leading-7 text-indigo-600"
            >
              <span aria-hidden="true">&larr;</span> Back
            </Link>
          </div>
          
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Repository not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The repository <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-sm">{owner}/{name}</code> is no longer available.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              It may have been deleted, made private, or moved to a different location.
            </p>
            <div className="mt-6">
              <Link
                href={`https://github.com/${owner}/${name}`}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try viewing on GitHub directly
              </Link>
            </div>
          </div>
        </div>
      );
    }
    
    // For other errors, throw to show error page
    throw error;
  }
}
