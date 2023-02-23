export default interface RepoNode {
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
