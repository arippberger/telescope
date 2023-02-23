"use client";

import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { Fragment } from "react";
import Image from "next/image";

import Stargazer from "../types/Stargazer";
import Topic from "../types/Topic";
import Commit from "../types/Commit";
import Repo from "../types/Repo";

export default function Tabs({ repo }: { repo: Repo }) {
  return (
    <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
      <Tab.Group as="div">
        <div className="border-b border-gray-200">
          <Tab.List className="-mb-px flex space-x-8">
            <Tab
              className={({ selected }) =>
                clsx(
                  selected
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300",
                  "whitespace-nowrap border-b-2 py-6 text-sm font-medium"
                )
              }
            >
              Topics
            </Tab>
            <Tab
              className={({ selected }) =>
                clsx(
                  selected
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300",
                  "whitespace-nowrap border-b-2 py-6 text-sm font-medium"
                )
              }
            >
              Stargazers
            </Tab>
            <Tab
              className={({ selected }) =>
                clsx(
                  selected
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300",
                  "whitespace-nowrap border-b-2 py-6 text-sm font-medium"
                )
              }
            >
              Commits
            </Tab>
          </Tab.List>
        </div>
        <Tab.Panels as={Fragment}>
          <Tab.Panel className="-mb-10">
            <h3 className="sr-only">Topics</h3>
            <div className="py-2 space-x-3 space-y-4">
              {repo.repositoryTopics.nodes ? (
                repo.repositoryTopics.nodes.map((topic: Topic, index) => (
                  <a
                    role="link"
                    key={`${topic.topic.id}-${index}`}
                    href={topic.url}
                    className="hover:bg-gray-200 inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800"
                  >
                    {topic.topic.name}
                  </a>
                ))
              ) : (
                <p>No Topics</p>
              )}
            </div>
          </Tab.Panel>

          <Tab.Panel className="text-sm text-gray-500">
            <h3 className="sr-only">Stargazers</h3>
            <ul className="py-4 space-y-4">
              {repo.stargazers?.nodes?.map((stargazer: Stargazer, index) => (
                <li
                  key={`${stargazer.id}-${index}`}
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  <div className="flex-shrink-0">
                    <Image
                      height={40}
                      width={40}
                      className="h-10 w-10 rounded-full"
                      src={stargazer.avatarUrl}
                      alt="Stargazer Avatar"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <a href={stargazer.url} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">
                        {stargazer.name}
                      </p>
                      <span className="truncate text-sm text-gray-500">
                        {stargazer.url}
                      </span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Tab.Panel>

          <Tab.Panel className="pt-4">
            <h3 className="sr-only">Commits</h3>
            <ul className="space-y-4">
              {repo.commitComments?.nodes?.map((commit: Commit, index) => (
                <li
                  key={`${commit.id}-${index}`}
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  <div className="flex-shrink-0">
                    <Image
                      height={40}
                      width={40}
                      className="h-10 w-10 rounded-full"
                      src={commit.author.avatarUrl}
                      alt="Commit Author Image"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <a href={commit.url} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">
                        {commit.bodyText}
                      </p>
                      <span className="truncate text-sm text-gray-500">
                        {commit.commit.message ?? "View Commit"}
                      </span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
