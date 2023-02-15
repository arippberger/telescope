import Star from "./star";

interface Stars {
  user: {
    starredRepositories: {
      totalCount: number;
      nodes: RepoObject[];
    };
  };
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
  const repos = props.stars.user.starredRepositories.nodes.map(
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

  return props.stars.user.starredRepositories.nodes.length ? (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          {props.searchValue}&apos;s GitHub Stars
        </h2>
        <ul
          role="list"
          className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {repos.map(
            (repo: RepoObject & { initials: string; slug: string }) => (
              <Star key={repo.name} repo={repo} />
            )
          )}
        </ul>
      </div>
    </div>
  ) : null;
}
