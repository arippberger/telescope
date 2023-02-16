import { render } from "@testing-library/react";
import Stars, { RepoObject } from "../../app/components/stars";
import Star from "../../app/components/star";

const mockProps = {
  searchValue: "test",
  stars: {
    user: {
      starredRepositories: {
        totalCount: 2,
        edges: [
          {
            starredAt: "2022-01-01",
            node: {
              name: "Test Repo 1",
              nameWithOwner: "user/repo1",
              description: "Test repo 1",
              forkCount: 1,
              isPrivate: false,
              languages: {
                edges: [{ node: { name: "JavaScript" } }],
              },
              pushedAt: "2022-01-01T00:00:00Z",
              repositoryTopics: { edges: [] },
              stargazerCount: 10,
              updatedAt: "2022-01-01T00:00:00Z",
              url: "https://github.com/user/repo1",
              href: "https://github.com/user/repo1",
            },
          },
          {
            starredAt: "2022-01-02",
            node: {
              name: "Test Repo 2",
              nameWithOwner: "user/repo2",
              description: "Test repo 2",
              forkCount: 0,
              isPrivate: true,
              languages: {
                edges: [{ node: { name: "TypeScript" } }],
              },
              pushedAt: "2022-01-02T00:00:00Z",
              repositoryTopics: { edges: [] },
              stargazerCount: 5,
              updatedAt: "2022-01-02T00:00:00Z",
              url: "https://github.com/user/repo2",
              href: "https://github.com/user/repo2",
            },
          },
        ],
        pageInfo: {
          endCursor: "cursor",
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "cursor",
        },
      },
    },
  },
};

describe("Stars", () => {
  it("renders correctly with props", () => {
    const { getByText, getAllByRole } = render(<Stars {...mockProps} />);

    expect(getByText("test's GitHub Stars")).toBeInTheDocument();

    const stars = getAllByRole("listitem");
    expect(stars).toHaveLength(2);

    stars.forEach((star, index) => {
      const name = star.querySelector("h4");
      const count = star.querySelector("p");

      expect(name).toHaveTextContent(
        index === 0 ? "Test Repo 1" : "Test Repo 2"
      );
      expect(count).toHaveTextContent(index === 0 ? "10 Stars" : "5 Stars");
    });
  });
});
