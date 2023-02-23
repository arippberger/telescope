export default interface Commit {
  author: {
    avatarUrl: string;
    url: string;
    login: string;
  };
  id: string;
  bodyText: string;
  url: string;
  commit: {
    message: string;
  };
}
