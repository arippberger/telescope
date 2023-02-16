"use client";

import { MagnifyingGlassIcon, UsersIcon } from "@heroicons/react/20/solid";
import { gql } from "graphql-request";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  searchValue: string;
  setStars: Dispatch<SetStateAction<any>>;
  setSearchValue: Dispatch<SetStateAction<any>>;
}

const USER_STARRED_REPOSITORIES_QUERY = gql`
  query ($username: String!) {
    user(login: $username) {
      starredRepositories(
        first: 12
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

export default function Search(props: Props) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUserStarsUsingFetch(props.searchValue).then((data) => {
      props.setStars({ data });
      setLoading(false);
    });
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setSearchValue(event.target.value);
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <label htmlFor="user" className="block text-sm font-medium text-gray-700">
        Enter GitHub Username
      </label>
      <form className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <UsersIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="search"
            name="user"
            id="user"
            role="textbox"
            className="block w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="arippberger"
            value={props.searchValue}
            onChange={handleInputChange}
          />
        </div>
        <Link
          href={props.searchValue ? `/users/${props.searchValue}` : '/'}
          className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <span>Search</span>
        </Link>
      </form>
    </div>
  );
}
