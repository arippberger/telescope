import { render, screen } from "@testing-library/react";
import ErrorComponent from "../app/error";
import "@testing-library/jest-dom";

let testError = new Error("Test Error");
let resetClicked = false;
let spy: jest.SpyInstance;

describe("Error", () => {
  beforeAll(() => {
    spy = jest.spyOn(global.console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    spy.mockRestore();
  });

  it("renders a heading and error message", () => {
    render(<ErrorComponent error={testError} reset={() => {}} />);

    const heading = screen.getByRole("heading", {
      name: /Error Heading/i,
    });

    const message = screen.getByRole("alert", {
      name: /Error Message/i,
    });

    expect(heading).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(heading).toHaveTextContent("Error");
    expect(message).toHaveTextContent("Test Error");
  });

  it("calls console.error with the error", () => {
    render(<ErrorComponent error={testError} reset={() => {}} />);
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it("provides a functioning reset button", () => {
    render(
      <ErrorComponent
        error={testError}
        reset={() => {
          resetClicked = true;
        }}
      />
    );

    const button = screen.getByRole("button", {
      name: /Reset Error/i,
    });

    expect(button).toBeInTheDocument();

    button.click();

    expect(resetClicked).toBe(true);
  });
});
