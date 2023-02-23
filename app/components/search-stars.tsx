"use client";

import { useState } from "react";
import Search from "./search";
import Stars from "./stars";
import { FadeLoader } from "react-spinners";
import Pagination from "./pagination";

interface Props {
  user: string;
}

export default function SearchStars(props: Props) {
  const [searchValue, setSearchValue] = useState(props.user ?? "");
  const [nextPage, setNextPage] = useState("");
  const [previousPage, setPreviousPage] = useState("");
  const [page, setPage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [stars, setStars] = useState<any>({
    user: {
      starredRepositories: {
        totalCount: 0,
        edges: [],
        pageInfo: {
          endCursor: "",
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "",
        },
      },
    },
  });

  const handleNextPage = ({ cursor }: { cursor: string }) => {
    setPage(cursor);
  };

  const handlePreviousPage = ({ cursor }: { cursor: string }) => {
    setPage(cursor);
  };

  return (
    <>
      <Search
        searchValue={searchValue}
        setStars={setStars}
        setSearchValue={setSearchValue}
        setNextPage={setNextPage}
        setPreviousPage={setPreviousPage}
        cursor={page}
        setIsLoading={setIsLoading}
      />
      {isLoading ? (
        <div className="flex justify-center my-1 mt-20">
          <FadeLoader color="#9089FC" />
        </div>
      ) : (
        <>
          <Stars searchValue={searchValue} stars={stars} />
          <div className="container mx-auto">
            <Pagination
              handleNextPage={handleNextPage}
              handlePreviousPage={handlePreviousPage}
              nextPage={nextPage}
              previousPage={previousPage}
            />
          </div>
        </>
      )}
    </>
  );
}
