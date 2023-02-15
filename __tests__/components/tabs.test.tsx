import { render, screen } from "@testing-library/react";
import Tabs from '../../app/components/tabs';

describe("Tabs Component", () => {
  const mockRepo = {
    repositoryTopics: {
      nodes: [
        {
          topic: { id: "1", name: "React" },
          url: "https://github.com/facebook/react",
        },
        {
          topic: { id: "2", name: "Jest" },
          url: "https://github.com/facebook/jest",
        },
      ],
    },
    stargazers: {
      nodes: [
        {
          avatarUrl: "https://avatars.githubusercontent.com/u/5421248?v=4",
          id: "MDQ6VXNlcjU0MjEyNDg=",
          name: "John Doe",
          url: "https://github.com/johndoe",
        },
      ],
    },
    commitComments: {
      nodes: [
        {
          author: {
            avatarUrl: "https://avatars.githubusercontent.com/u/5421248?v=4",
            login: "johndoe",
            url: "https://github.com/johndoe",
          },
          bodyText: "Test commit message",
          commit: {
            message: "Test commit message",
          },
          id: "MDIzOjE2NTU1MDQyMzc6Y29tbWl0",
          url: "https://github.com/johndoe/repo/commit/a1b2c3d4e5f6",
        },
      ],
    },
  };

  it("renders the Topics panel", () => {
    render(<Tabs repo={mockRepo} />);
    const topicsPanel = screen.getByRole("tabpanel", { name: "Topics" });
    expect(topicsPanel).toBeInTheDocument();
  });

  it("renders the Stargazers panel", () => {
    render(<Tabs repo={mockRepo} />);
    const stargazersPanel = screen.getByRole("tabpanel", {
      name: "Stargazers",
    });
    expect(stargazersPanel).toBeInTheDocument();
  });

  it("renders the Commits panel", () => {
    render(<Tabs repo={mockRepo} />);
    const commitsPanel = screen.getByRole("tabpanel", { name: "Commits" });
    expect(commitsPanel).toBeInTheDocument();
  });
});
