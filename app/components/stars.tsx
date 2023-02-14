import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { use } from "react";
import Star from "./star";
// import useSWR from 'swr';
// import { request, gql, RequestDocument, Variables } from 'graphql-request';

// const fetcher = (query: RequestDocument, variables: Variables | undefined) => request('https://api.github.com/graphql', query, variables);

// async function getUserStars(username: string) {
//     const variables = {
//         username: username,
//         after: '',
//     };

//     console.log(getUserStars);

//     const response = await useSWR([
//         `query ($username: String!, $after: String) {
//             user(login: $username) {
//                 starredRepositories(first: 100, after: $after, orderBy: {direction: DESC, field: STARRED_AT}) {
//                     totalCount
//                     nodes {
//                         name
//                         nameWithOwner
//                         description
//                         url
//                         stargazerCount
//                         forkCount
//                         isPrivate
//                         pushedAt
//                         updatedAt
//                         languages(first: 1, orderBy: {field: SIZE, direction: DESC}) {
//                             edges {
//                                 node {
//                                     id
//                                     name
//                                 }
//                             }
//                         }
//                         repositoryTopics(first: 100) {
//                             nodes {
//                                 topic {
//                                     name
//                                     stargazerCount
//                                 }
//                             }
//                         }
//                     }
//                     pageInfo {
//                         endCursor
//                         hasNextPage
//                     }
//                 }
//             }
//         }`,
//         variables,
//     ],
//         ([url, token]) => fetcher(url, variables));

//     console.log('response', response);

//     return response;
// }

async function getUserStarsUsingFetch(username: string) {
  return await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.NEXT_PUBLIC_GITHUB_TOKEN,
    },
    body: JSON.stringify({
      query: `
            query ($username: String!) {
                user(login: $username) {
                    starredRepositories(first: 100, orderBy: {direction: DESC, field: STARRED_AT}) {
                        totalCount
                        nodes {
                            name
                            nameWithOwner
                            description
                            url
                            stargazerCount
                            forkCount
                            isPrivate
                            pushedAt
                            updatedAt
                            languages(first: 1, orderBy: {field: SIZE, direction: DESC}) {
                                edges {
                                    node {
                                        id
                                        name
                                        color
                                    }
                                }
                            }
                            repositoryTopics(first: 100) {
                                nodes {
                                    topic {
                                        name
                                        stargazerCount
                                    }
                                }
                            }
                        }
                        pageInfo {
                            endCursor
                            hasNextPage
                        }
                    }
                }
            }`,
      variables: {
        username: username,
      },
    }),
  }).then((res) => res.json());
}

interface Props {
  searchValue: string;
}

interface RepoObject {
  description: string;
  forkCount: number;
  isPrivate: boolean;
  languages: {
    edges: any;
  };
  name: string;
  nameWithOwner: string;
  pushedAt: string;
  repositoryTopics: Object;
  stargazerCount: number;
  updatedAt: string;
  url: string;
  href: string;
}

export default function Stars(props: Props) {
  console.log("Stars");

  let { data } = use(getUserStarsUsingFetch(props.searchValue));

  const repos = data.user.starredRepositories.nodes.map(
    (repo: RepoObject) => {
      return {
        ...repo,
        slug: repo.nameWithOwner.replace(/\//g, "-"),
        initials: repo.name
          .split(/[-_]/)
          .map((word: string) => word[0])
          .join("")
          .toUpperCase(),
      };
    }
  );

  // const { data, error, isLoading } = await getUserStars(props.searchValue);

  // if (error) return <div>failed to load</div>
  // if (isLoading) return <div>loading...</div>

  // console.log(data);

  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          {props.searchValue}&apos;s GitHub Stars
        </h2>
        <ul
          role="list"
          className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {repos.map((repo: RepoObject & { initials: string, slug: string }) => (
            <Star key={repo.name} repo={repo} />
          ))}
        </ul>
      </div>
    </div>
  );
}
