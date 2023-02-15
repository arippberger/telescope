import { render, screen, waitFor } from "@testing-library/react";
import SearchStars from "../../app/components/search-stars";

jest.mock("graphql-request", () => ({
  gql: jest.fn().mockImplementation((query: string) => query),
}));

describe("SearchStars", () => {
  test("renders search input and button", () => {
    render(<SearchStars />);
    const searchInput = screen.getByRole("textbox", { name: /user/i });
    const searchButton = screen.getByRole("button");
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });
});
