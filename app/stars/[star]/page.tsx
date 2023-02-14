import { Fragment, use } from "react";
// import { Tab } from '@headlessui/react'
import { gql } from "graphql-request";
import Tabs from '../../components/tabs';

const STARRED_REPOSITORY_QUERY = gql`
query($name: String!, $owner: String!) {
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

function getRepositoryUsingFetch(name: string, owner: string) {
  return fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.NEXT_PUBLIC_GITHUB_TOKEN,
    },
    body: JSON.stringify({
      query: STARRED_REPOSITORY_QUERY,
      variables: {
        name,
        owner,
      },
    }),
  }).then((res) => res.json());
}

function getRepoBySlug(slug: string) {
  const ownerName = slug.split("-")[0];
  const repositoryName = slug.slice(slug.indexOf("-") + 1);

  return getRepositoryUsingFetch(repositoryName, ownerName);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Page({ params }: { params: { star: string } }) {
  const { data } = use(getRepoBySlug(params.star));

  console.log("data", data);

  const repo = data.repository;

  return (
    <div className="bg-white">
      <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* Product */}
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:col-span-4 lg:row-end-1">
            <div className="rounded-lg bg-gray-100">
              <img
                src={repo.openGraphImageUrl}
                alt={`${repo.name} repository image`}
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Product details */}
          <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {repo.name}
                </h1>

                <h2 id="information-heading" className="sr-only">
                  Starred Repository Information
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  {repo.releases.nodes[0]?.tag?.name ? `Version ${repo.releases.nodes[0].tag.name}` : null} (Updated{" "}
                  <time dateTime={repo.updatedAt}>{formatDate(repo.updatedAt)}</time>)
                </p>
              </div>
            </div>

            <p className="mt-6 text-gray-500">{repo.description}</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <a
                target="_blank"
                href={repo.url}
                type="button"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Visit {repo.name}
              </a>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
              <div className="prose prose-sm mt-4 text-gray-500">
                <ul role="list">
                  <li>
                    <strong>Fork Count:</strong>{" "}
                    {repo.forkCount}
                  </li>
                  <li>
                    <strong>Stargazer Count:</strong>{" "}
                    {repo.stargazerCount}
                  </li>
                  <li>
                    <strong>Watchers Count:</strong>{" "}
                    {repo.watchers.totalCount}
                  </li>
                  <li>
                    <strong>Visibility:</strong>{" "}
                    {repo.visibility}
                  </li>
                </ul>
              </div>
            </div>

            {repo.licenseInfo && (
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="text-sm font-medium text-gray-900">{repo.licenseInfo.name}</h3>
                <p className="mt-4 text-sm text-gray-500">
                  {repo.licenseInfo.description}{" "}
                  <a
                    href={repo.licenseInfo.url}
                    className="font-medium text-indigo-600 hover:text-indigo-500 block mt-2"
                  >
                    Read full license
                  </a>
                </p>
              </div>
            )}
          </div>
            <Tabs repo={repo}></Tabs>
        </div>
      </div>
    </div>
  );
}
