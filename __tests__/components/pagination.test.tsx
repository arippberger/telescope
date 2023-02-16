import { render, fireEvent } from "@testing-library/react";
import Pagination from "../../app/components/pagination";

describe("Pagination", () => {
  it("should render Previous button when `previousPage` prop is provided", () => {
    const { getByText } = render(
      <Pagination
        handleNextPage={() => {}}
        handlePreviousPage={() => {}}
        previousPage="https://example.com/page/1"
      />
    );
    expect(getByText(/Previous/)).toBeInTheDocument();
  });

  it("should not render Previous button when `previousPage` prop is not provided", () => {
    const { queryByText } = render(
      <Pagination handleNextPage={() => {}} handlePreviousPage={() => {}} />
    );
    expect(queryByText(/Previous/)).not.toBeInTheDocument();
  });

  it("should render Next button when `nextPage` prop is provided", () => {
    const { getByText } = render(
      <Pagination
        handleNextPage={() => {}}
        handlePreviousPage={() => {}}
        nextPage="https://example.com/page/3"
      />
    );
    expect(getByText(/Next/)).toBeInTheDocument();
  });

  it("should not render Next button when `nextPage` prop is not provided", () => {
    const { queryByText } = render(
      <Pagination handleNextPage={() => {}} handlePreviousPage={() => {}} />
    );
    expect(queryByText(/Next/)).not.toBeInTheDocument();
  });

  it("should call `handlePreviousPage` when Previous button is clicked", () => {
    const handlePreviousPage = jest.fn();
    const { getByText } = render(
      <Pagination
        handleNextPage={() => {}}
        handlePreviousPage={handlePreviousPage}
        previousPage="https://example.com/page/1"
      />
    );
    fireEvent.click(getByText(/Previous/));
    expect(handlePreviousPage).toHaveBeenCalled();
  });

  it("should call `handleNextPage` when Next button is clicked", () => {
    const handleNextPage = jest.fn();
    const { getByText } = render(
      <Pagination
        handleNextPage={handleNextPage}
        handlePreviousPage={() => {}}
        nextPage="https://example.com/page/3"
      />
    );
    fireEvent.click(getByText(/Next/));
    expect(handleNextPage).toHaveBeenCalled();
  });
});
