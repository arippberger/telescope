import { render, screen, fireEvent } from "@testing-library/react";
import Nav from "../../app/components/nav";

describe("Nav", () => {
  beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it("renders without crashing", () => {
    render(<Nav />);
  });

  it("renders the navigation links", () => {
    render(<Nav />);
    const navLinks = screen.getAllByRole("link", { name: /(Stars|About)/ });
    expect(navLinks).toHaveLength(2);
  });

  it("closes mobile menu when close button is clicked", () => {
    const { getByRole, queryByRole } = render(<Nav />);
    const menuButton = getByRole("button", { name: "Open main menu" });
    fireEvent.click(menuButton);
    const closeButton = getByRole("button", { name: "Close menu" });
    fireEvent.click(closeButton);
    expect(queryByRole("dialog")).toBeNull();
  });

  it("navigates to Stars page when Stars link is clicked", () => {
    const { getByRole } = render(<Nav />);
    const starsLink = getByRole("link", { name: "Stars" });
    fireEvent.click(starsLink);
    expect(window.location.pathname).toBe("/");
  });
});
