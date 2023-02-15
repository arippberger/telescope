import { render } from "@testing-library/react";
import Star from '../../app/components/star';

describe("Star component", () => {
  const repo = {
    slug: "test/repo",
    description: "Test repository",
    forkCount: 5,
    isPrivate: false,
    languages: {
      edges: [
        { node: { color: "#0074D9", name: "JavaScript" } },
        { node: { color: "#000000", name: "CSS" } }
      ]
    },
    name: "Test Repo",
    nameWithOwner: "test/test-repo",
    pushedAt: "2022-02-14T08:00:00Z",
    repositoryTopics: {},
    stargazerCount: 10,
    updatedAt: "2022-02-14T08:00:00Z",
    url: "https://github.com/test/test-repo",
    href: "/test/repo",
    initials: "TR"
  };

  it("renders the repo name", () => {
    const { getByText } = render(<Star repo={repo} />);
    expect(getByText("Test Repo")).toBeInTheDocument();
  });

  it("renders the number of stars", () => {
    const { getByText } = render(<Star repo={repo} />);
    expect(getByText("10 Stars")).toBeInTheDocument();
  });

  // skip this test for now
  it.skip("renders the 'Star' button when user is signed in", () => {
    const { getByText } = render(<Star repo={repo} />);
    expect(getByText("Star")).toBeInTheDocument();
  });

  // skip this test for now
  it.skip("does not render the 'Star' button when user is not signed in", () => {
    const { queryByText } = render(<Star repo={repo} />);
    expect(queryByText("Star")).not.toBeInTheDocument();
  });
});
