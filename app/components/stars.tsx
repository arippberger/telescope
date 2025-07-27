"use client";

import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import Star from "./star";
import StarsInterface from "../types/Stars";
import { generateRepositorySlug } from "../lib/github";
import { StarredRepositoryEdge, RepositoryWithUIProps } from "../types/github-api";

interface Props {
  searchValue: string;
  stars: StarsInterface;
}

export default function Stars(props: Props) {
  // Handle case where user is null
  if (!props.stars.user) {
    return (
      <div className="mt-10 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">User not found</h3>
          <p className="text-gray-500">The user {props.searchValue} could not be found.</p>
        </div>
      </div>
    );
  }

  const pages = [
    { name: "Telescope", href: "/", current: false },
    { name: props.searchValue, href: "#", current: true },
  ];

  const repos: RepositoryWithUIProps[] = props.stars.user.starredRepositories.edges.map((repo: StarredRepositoryEdge) => {
    const node = repo.node;
    return {
      ...node,
      name: node.name.length > 12 ? node.name.slice(0, 12) + "..." : repo.node.name,
      slug: generateRepositorySlug(node.nameWithOwner),
      href: `/users/${props.searchValue}/stars/${generateRepositorySlug(node.nameWithOwner)}`,
      initials: node.name.split(/[-_]/).map((word: string) => word[0]).join("").toUpperCase(),
    };
  });

  return (
    <div className="mx-auto max-w-4xl">
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          <li>
            <div>
              <Link href="/" className="text-gray-400 hover:text-gray-500">
                <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </Link>
            </div>
          </li>
          {pages.map((page) => (
            <li key={page.name}>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <Link
                  href={page.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  aria-current={page.current ? "page" : undefined}
                >
                  {page.name}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-8">
        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {props.stars.user.starredRepositories.totalCount} Starred Repositories
        </h3>
        <ul
          role="list"
          className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {repos.map((repo: RepositoryWithUIProps, index: number) => (
            <Star key={`${repo.name}-${index}`} repo={repo} searchValue={props.searchValue} />
          ))}
        </ul>
      </div>
    </div>
  );
}
