import { render, fireEvent } from "@testing-library/react";
import Search from "../../app/components/search";

it.skip("renders input field and button", () => {
  const { getByTestId } = render(
    <Search
      searchValue={""}
      setStars={function (value: any): void {}}
      setSearchValue={function (value: any): void {}}
      setNextPage={function (value: any): void {}}
      setPreviousPage={function (value: any): void {}}
      setIsLoading={function (value: any): void {}}
    />
  );
  const inputElement = getByTestId("search-input");
  const buttonElement = getByTestId("search-button");

  expect(inputElement).toBeInTheDocument();
  expect(buttonElement).toBeInTheDocument();
});

it.skip("handles search input change", () => {
  const setSearchValue = jest.fn();
  const { getByTestId } = render(
    <Search
      searchValue={""}
      setStars={function (value: any): void {}}
      setSearchValue={setSearchValue}
      setNextPage={function (value: any): void {}}
      setPreviousPage={function (value: any): void {}}
      setIsLoading={function (value: any): void {}}
    />
  );
  const inputElement = getByTestId("search-input");

  fireEvent.change(inputElement, { target: { value: "arippberger" } });

  expect(setSearchValue).toHaveBeenCalledWith("arippberger");
});
