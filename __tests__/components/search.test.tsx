import { render, screen, fireEvent } from "@testing-library/react";
import Search from '../../app/components/search';

describe("Search", () => {
  test("renders search input and button", () => {
    render(<Search searchValue="" handleSearch={() => {}} setSearchValue={() => {}} />);
    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button");
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test("calls handleSearch function when button is clicked", () => {
    const handleSearch = jest.fn();
    render(<Search searchValue="" handleSearch={handleSearch} setSearchValue={() => {}} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  test("updates searchValue state when input is changed", () => {
    const setSearchValue = jest.fn();
    render(<Search searchValue="" handleSearch={() => {}} setSearchValue={setSearchValue} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    expect(setSearchValue).toHaveBeenCalledTimes(1);
    expect(setSearchValue).toHaveBeenCalledWith("test");
  });
});
