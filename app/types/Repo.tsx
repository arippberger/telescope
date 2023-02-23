import Stargazer from "./Stargazer";
import Topic from "./Topic";
import Commit from "./Commit";

export default interface Repo {
  name: string;
  nameWithOwner: string;
  description: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  isPrivate: boolean;
  pushedAt: string;
  updatedAt: string;
  stargazers: {
    nodes: Stargazer[];
  };
  languages: {
    edges: {
      node: {
        id: string;
        name: string;
        color: string;
      };
    }[];
  };
  repositoryTopics: {
    nodes: Topic[];
  };
  commitComments: {
    nodes: Commit[];
  };
  licenseInfo: {
    name: string;
    description: string;
  };
}
