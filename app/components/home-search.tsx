"use client";

import { MagnifyingGlassIcon, UsersIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React, { RefObject } from "react";
import { useRef, useState } from "react";

interface ButtonRefInterface {
  divRef: RefObject<HTMLDivElement>;
}

export default function HomeSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [isEmptyError, setIsEmptyError] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setIsEmptyError(false);
  };

  const handleEmptySearch = (e: { preventDefault: () => void }) => {
    if (searchValue === "") {
      setIsEmptyError(true);
      e.preventDefault();
    }
  };

  const buttonRef = useRef<HTMLAnchorElement>(null);

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === "Enter" && buttonRef.current !== null) {
      buttonRef.current.focus();
      buttonRef.current.click();
    }
  };

  return (
    <>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <label
          htmlFor="user"
          className="block text-sm font-medium text-gray-700"
        >
          Enter GitHub Username
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
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
              placeholder="username"
              value={searchValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
          </div>

          {isEmptyError || searchValue === "" ? (
            <button
              onClick={handleEmptySearch}
              className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled"
            >
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span>Search</span>
            </button>
          ) : (
            <Link
              legacyBehavior={true}
              href={`/users/${searchValue}`}
              onClick={handleEmptySearch}
            >
              <a
                ref={buttonRef}
                className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span>Search</span>
              </a>
            </Link>
          )}
        </div>
      </div>
      {isEmptyError && (
        <div className="mt-4 flex items-center justify-center">
          <div
            className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
            role="alert"
          >
            <p className="font-bold">No User</p>
            <p>Please enter a valid GitHub user.</p>
          </div>
        </div>
      )}
    </>
  );
}
