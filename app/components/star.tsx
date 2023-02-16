'use client';

import { Menu, Transition } from "@headlessui/react";
import { EyeIcon, StarIcon, EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import clsx from "clsx";
import Link from "next/link";

interface Repo {
  slug: string,
  description: string,
  forkCount: number,
  isPrivate: boolean,
  languages: {
    edges: any,
  },
  name: string,
  nameWithOwner: string,
  pushedAt: string,
  repositoryTopics: Object,
  stargazerCount: number,
  updatedAt: string,
  url: string,
  href: string,
  initials: string,
}

interface Props {
  repo: Repo,
  searchValue: string,
}

const userSignedIn = false;

export default function Star(props: Props) {
  const { repo, searchValue } = props;

  return (
    <li key={repo.name} className="col-span-1 flex rounded-md shadow-sm">
      <div
        className={clsx(
          "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
        )}
        style={{
          backgroundColor: repo.languages.edges[0]?.node.color ?? "#000000",
        }}
      >
        {repo.initials}
      </div>
      <div className={clsx("flex flex-1 items-center justify-between rounded-r-md border-t border-r border-b border-gray-200 bg-white")}>
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <h4
            className="font-medium text-gray-900"
          >
            {repo.name}
          </h4>
          <p className="text-gray-500">{repo.stargazerCount} Stars</p>
        </div>
        <div className="flex-shrink-0 pr-2">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {userSignedIn && (
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={clsx(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "flex px-4 py-2 text-sm"
                          )}
                        >
                          <StarIcon
                            className="mr-3 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span>Star</span>
                        </a>
                      )}
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href={`/users/${searchValue}/stars/${repo.slug}`}
                        className={clsx(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "flex px-4 py-2 text-sm"
                        )}
                      >
                        <EyeIcon
                          className="mr-3 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>View</span>
                      </Link>
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
