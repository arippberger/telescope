"use client";

import { MagnifyingGlassIcon, UsersIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

interface Props {
  searchSubmit: (value: string) => void;
}

export default function Search(props: Props) {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
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
            type="user"
            name="user"
            id="user"
            className="block w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="arippberger"
            value={searchValue}
            onChange={handleChange}
          />
        </div>
        <button
          type="button"
          onClick={() => props.searchSubmit(searchValue)}
          className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
}
