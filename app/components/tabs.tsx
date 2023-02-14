"use client";

import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { Fragment } from "react";

interface Stargazer {
  avatarUrl: string;
  id: string;
  name: string;
  url: string;
}

interface Topic {
  url: string;
  topic: {
    name: string;
    id: string;
  };
}

interface Commit {
  author: {
    avatarUrl: string;
    url: string;
    login: string;
  };
  id: string;
  bodyText: string;
  url: string;
  commit: {
    message: string;
  };
}

export default function Tabs({repo}) {
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
            

            {repo.repositoryTopics.nodes ? repo.repositoryTopics.nodes.map(
              (topic: Topic, topicCount: number) => (
                <div
                  key={topic.topic.id}
                  className="flex space-x-4 text-sm text-gray-500"
                >
                  <div
                    className={clsx(
                      topicCount === 0 ? "" : "border-t border-gray-200",
                      "py-10"
                    )}
                  >
                    <h3 className="font-medium text-gray-900">
                      {topic.topic.name}
                    </h3>
                    <a href={topic.url}>View Topic</a>
                  </div>
                </div>
              )
            ) : <p>No Topics</p>}
          </Tab.Panel>

          <Tab.Panel className="text-sm text-gray-500">
            <h3 className="sr-only">Stargazers</h3>
            <ul>
              {repo.stargazers?.nodes?.map((stargazer: Stargazer) => (
                <li
                  key={stargazer.id}
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={stargazer.avatarUrl}
                      alt=""
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">
                        {stargazer.name}
                      </p>
                      <a
                        href={stargazer.url}
                        className="truncate text-sm text-gray-500"
                      >
                        {stargazer.url}
                      </a>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Tab.Panel>

          <Tab.Panel className="pt-10">
            <h3 className="sr-only">Commits</h3>
            <ul>
              {repo.commitComments?.nodes?.map((commit: Commit) => (
                <li
                  key={commit.id}
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={commit.author.avatarUrl}
                      alt="Commit Author Image"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">
                        {commit.bodyText}
                      </p>
                      <a
                        href={commit.url}
                        className="truncate text-sm text-gray-500"
                      >
                        {commit.commit.message ?? "View Commit"}
                      </a>
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
