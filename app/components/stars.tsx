"use client";

import Star from "./star";
import StarsInterface from "../types/Stars";
import RepoNode from "../types/RepoNode";
import { generateRepositorySlug } from "../lib/github";
import { StarredRepositoryEdge, RepositoryWithSlug } from "../types/github-api";

interface StarRepo extends RepositoryWithSlug {
  href: string;
}

interface Props {
  searchValue: string;
  stars: StarsInterface;
}

export default function Stars(props: Props) {
  if (!props.stars.user) {
    return (
      <div
        className="mt-4 flex items-center justify-center"
        aria-live="assertive"
      >
        <div
          className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
          role="alert"
        >
          <p className="font-bold">No User</p>
          <p>Please enter a valid GitHub user.</p>
        </div>
      </div>
    );
  }

  const repos = props.stars.user.starredRepositories.edges.map(
    (repo: StarredRepositoryEdge, index: number) => {
      const node = repo.node;

      return {
        ...node,
        name:
          node.name.length > 12
            ? node.name.slice(0, 12) + "..."
            : repo.node.name,
        slug: generateRepositorySlug(node.nameWithOwner),
        href: `/users/${props.searchValue}/stars/${generateRepositorySlug(node.nameWithOwner)}`,
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
            (repo: RepositoryWithSlug, index: number) => (
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
