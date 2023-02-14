"use client";

import { useState } from "react";
import Search from "./search";
import Stars from "./stars";

export default function SearchStars() {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchSubmit = (value: string) => {
    setSearchValue(value);
  };

  return (
    <>
      <Search searchSubmit={handleSearchSubmit} />
      {searchValue ? <Stars searchValue={searchValue} /> : null}
    </>
  );
}
