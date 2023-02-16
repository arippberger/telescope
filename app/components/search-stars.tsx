"use client";

import { useState } from "react";
import Search from "./search";
import Stars from "./stars";
import { FadeLoader } from "react-spinners";

interface Stars {
  data: {
    data: {
      user: {
        starredRepositories: {
          totalCount: number;
          nodes: any;
        };
      };
    };
  };
}

interface Props {
  user: string;
}

export default function SearchStars(props: Props) {
  const [searchValue, setSearchValue] = useState(props.user ?? "");
  const [stars, setStars] = useState<Stars>({
    data: {
      data: { user: { starredRepositories: { totalCount: 0, nodes: [] } } },
    },
  });

  return (
    <>
      <Search
        searchValue={searchValue}
        setStars={setStars}
        setSearchValue={setSearchValue}
      />
      {stars.data.data.user?.starredRepositories.totalCount > 0 ? (
        <Stars searchValue={searchValue} stars={stars} />
      ) : (
        <div className="flex justify-center my-10">
          <FadeLoader color="#9089FC" />
        </div>
      )}
    </>
  );
}
