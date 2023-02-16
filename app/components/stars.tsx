"use client";

import Star from "./star";

interface Stars {
  user: {
    starredRepositories: {
      totalCount: number;
      edges: any,
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
      };
    };
  };
}

interface Props {
  searchValue: string;
  stars: Stars;
}

interface RepoNode {
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

export interface RepoObject {
  starredAt: string;
  node: RepoNode;
}

export default function Stars(props: Props) {

  const repos = props.stars.user.starredRepositories.edges.map(
    (repo: RepoObject) => {
      const node = repo.node;

      return {
        ...node,
        name:
          node.name.length > 12
            ? node.name.slice(0, 12) + "..."
            : repo.node.name,
        slug: node.nameWithOwner.replace(/\//g, "-"),
        initials: node.name
          .split(/[-_]/)
          .map((word: string) => word[0])
          .join("")
          .toUpperCase(),
      };
    }
  );

  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <div>
        {props.searchValue && (
          <h2 className="text-sm font-medium text-gray-500">
            {props.searchValue}&apos;s GitHub Stars
          </h2>
        )}
        <ul
          role="list"
          className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {repos.map(
            (
              repo: RepoNode & { initials: string; slug: string },
              index: any
            ) => (
              <Star
                key={`${repo.name}-${index}`}
                repo={repo}
                searchValue={props.searchValue}
              />
            )
          )}
        </ul>
      </div>
    </div>
  );
}
