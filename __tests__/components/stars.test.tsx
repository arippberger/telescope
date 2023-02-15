import { render } from "@testing-library/react";
import Stars, { RepoObject } from '../../app/components/stars';

const testStars: RepoObject[] = [
  {
    description: "test description",
    forkCount: 1,
    isPrivate: false,
    languages: { edges: [] },
    name: "Test Repo",
    nameWithOwner: "testuser/test-repo",
    pushedAt: "2022-02-14T15:19:21Z",
    repositoryTopics: {},
    stargazerCount: 5,
    updatedAt: "2022-02-14T15:19:21Z",
    url: "https://github.com/testuser/test-repo",
    href: "https://github.com/testuser/test-repo",
  },
];

const testProps = {
  searchValue: "testuser",
  stars: {
    user: {
      starredRepositories: {
        totalCount: 1,
        nodes: testStars,
      },
    },
  },
};

describe("Stars", () => {
  it("renders with correct title", () => {
    const { getByText } = render(<Stars {...testProps} />);
    const title = getByText(`${testProps.searchValue}'s GitHub Stars`);
    expect(title).toBeInTheDocument();
  });

  it("does not render when no stars are present", () => {
    const { container } = render(
      <Stars
        searchValue={testProps.searchValue}
        stars={{ user: { starredRepositories: { totalCount: 0, nodes: [] } } }}
      />
    );
    expect(container.firstChild).toBeNull();
  });
});
