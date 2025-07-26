"use client";

import { MagnifyingGlassIcon, UsersIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";
import { useRef } from "react";

interface Props {
  searchValue: string;
}

export default function Search({ searchValue }: Props) {
  const [inputValue, setInputValue] = useState(searchValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const buttonRef = useRef<HTMLAnchorElement>(null);

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === "Enter" && buttonRef.current !== null) {
      buttonRef.current.focus();
      buttonRef.current.click();
    }
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <label htmlFor="user" className="block text-sm font-medium text-gray-700">
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
            data-testid="search-input"
            role="textbox"
            className="block w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="username"
            value={inputValue}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
          />
        </div>
        <Link
          ref={buttonRef}
          data-testid="search-button"
          href={inputValue ? `/users/${inputValue}` : "/"}
          className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <span>Search</span>
        </Link>
      </div>
    </div>
  );
}
