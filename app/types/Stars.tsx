export default interface Stars {
  user: {
    starredRepositories: {
      totalCount: number;
      edges: any;
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
      };
    };
  };
}
