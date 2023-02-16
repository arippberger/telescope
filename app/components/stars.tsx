'use client';

import Star from "./star";
import { FadeLoader } from "react-spinners";

interface Stars {
  data: {
    data: {
      user: {
        starredRepositories: {
          totalCount: number;
          nodes: RepoObject[];
        };
      };
    }
  }
}

interface Props {
  searchValue: string;
  stars: Stars;
}

export interface RepoObject {
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
  if (!props?.stars?.data?.data) return <FadeLoader />;

  const repos = props.stars.data.data.user.starredRepositories.nodes.map(
    (repo: RepoObject) => {
      return {
        ...repo,
        name:
          repo.name.length > 12 ? repo.name.slice(0, 12) + "..." : repo.name,
        slug: repo.nameWithOwner.replace(/\//g, "-"),
        initials: repo.name
          .split(/[-_]/)
          .map((word: string) => word[0])
          .join("")
          .toUpperCase(),
      };
    }
  );

  return props.stars.data.data.user.starredRepositories.nodes.length ? (
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
            (repo: RepoObject & { initials: string; slug: string }) => (
              <Star key={repo.name} repo={repo} searchValue={props.searchValue} />
            )
          )}
        </ul>
      </div>
    </div>
  ) : null;
}
