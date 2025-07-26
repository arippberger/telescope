'use client';

import { Menu, Transition } from "@headlessui/react";
import { EyeIcon, StarIcon, EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import clsx from "clsx";
import Link from "next/link";
import { RepositoryWithUIProps } from "../types/github-api";

interface Props {
  repo: RepositoryWithUIProps;
  searchValue: string,
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function Star({ repo, searchValue }: Props) {
  return (
    <li
      key={repo.name}
      data-testid="repository-card"
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
    >
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-gray-900">
              <Link
                href={`/users/${searchValue}/stars/${repo.slug}`}
                className="text-blue-600 hover:text-blue-900"
              >
                {repo.name}
              </Link>
            </h3>
            <span
              className={clsx(
                repo.primaryLanguage
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800",
                "inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ring-green-600/20"
              )}
            >
              {repo.primaryLanguage ? repo.primaryLanguage.name : "Unknown"}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-gray-500">
            {repo.description}
          </p>
          <div className="mt-3 flex space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <StarIcon className="h-4 w-4" />
              <span>{repo.stargazerCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <EyeIcon className="h-4 w-4" />
              <span>Updated {formatDate(repo.updatedAt)}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <Menu as="div" className="inline-block text-left">
            <div>
              <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={clsx(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        View on GitHub
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </li>
  );
}
