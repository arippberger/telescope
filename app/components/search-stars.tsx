'use client';

import { gql } from "graphql-request";
import { use, useState } from "react";
import Search from "./search";
import Stars from "./stars";

interface Stars {
  user: {
    starredRepositories: {
      totalCount: number;
      nodes: any;
    };
  };
}

const USER_STARRED_REPOSITORIES_QUERY = gql`
  query ($username: String!) {
    user(login: $username) {
      starredRepositories(
        first: 100
        orderBy: { direction: DESC, field: STARRED_AT }
      ) {
        totalCount
        nodes {
          name
          nameWithOwner
          description
          url
          stargazerCount
          forkCount
          isPrivate
          pushedAt
          updatedAt
          languages(first: 1, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              node {
                id
                name
                color
              }
            }
          }
          repositoryTopics(first: 100) {
            nodes {
              topic {
                name
                stargazerCount
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

function getUserStarsUsingFetch(username: string) {
  return fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: USER_STARRED_REPOSITORIES_QUERY,
      variables: {
        username: username,
      },
    }),
  }).then((res) => res.json());
}

export default function SearchStars() {
  const [searchValue, setSearchValue] = useState("");
  const [stars, setStars] = useState<Stars>({user: {starredRepositories: {totalCount: 0, nodes: []}}});

  const handleSearchSubmit = async () => {
    const {data} = await getUserStarsUsingFetch(searchValue);
    setStars(data);
  };

  return (
    <>
      <Search
        setSearchValue={setSearchValue}
        handleSearch={handleSearchSubmit} searchValue={searchValue} />
      <Stars searchValue={searchValue} stars={stars} />
    </>
  );
}
