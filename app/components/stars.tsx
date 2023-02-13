import {TypedDocumentNode} from '@graphql-typed-document-node/core';
import {EllipsisVerticalIcon} from '@heroicons/react/20/solid';
import {request, gql, RequestDocument, Variables} from 'graphql-request';
import useSWR from 'swr';

const projects = [
    {name: 'Graph API', initials: 'GA', href: '#', members: 16, bgColor: 'bg-pink-600'},
    {name: 'Component Design', initials: 'CD', href: '#', members: 12, bgColor: 'bg-purple-600'},
    {name: 'Templates', initials: 'T', href: '#', members: 16, bgColor: 'bg-yellow-500'},
    {name: 'React Components', initials: 'RC', href: '#', members: 8, bgColor: 'bg-green-500'},
];


const fetcher = (query: RequestDocument, variables: Variables | undefined) => request('https://api.github.com/graphql', query, variables);

async function getUserStars(username: string) {
    const variables = {
        username: username,
        after: '',
    };

    return useSWR([
            `query ($username: String!, $after: String) {
            user(login: $username) {
                starredRepositories(first: 100, after: $after, orderBy: {direction: DESC, field: STARRED_AT}) {
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
            variables,
        ],
        ([url, token]) => fetcher(url, variables));
}


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

interface Props {
    searchValue: string,
}

export default async function Stars(props: Props) {
    const { data, error, isLoading } = await getUserStars(props.searchValue);

    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>

    console.log(data);

    return (
        <div className="mt-10 flex items-center justify-center gap-x-6">
            <div>
                <h2 className="text-sm font-medium text-gray-500">{props.searchValue} GitHub Stars</h2>
                <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                    {projects.map((project) => (
                        <li key={project.name} className="col-span-1 flex rounded-md shadow-sm">
                            <div
                                className={classNames(
                                    project.bgColor,
                                    'flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md'
                                )}
                            >
                                {project.initials}
                            </div>
                            <div
                                className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                                <div className="flex-1 truncate px-4 py-2 text-sm">
                                    <a href={project.href} className="font-medium text-gray-900 hover:text-gray-600">
                                        {project.name}
                                    </a>
                                    <p className="text-gray-500">{project.members} Members</p>
                                </div>
                                <div className="flex-shrink-0 pr-2">
                                    <button
                                        type="button"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <span className="sr-only">Open options</span>
                                        <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true"/>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
