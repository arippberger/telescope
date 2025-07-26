import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";

interface Props {
  user: string;
  nextPageCursor: string | null;
  previousPageCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function Pagination({
  user,
  nextPageCursor,
  previousPageCursor,
  hasNextPage,
  hasPreviousPage,
}: Props) {
  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <nav className="flex flex-1 items-center justify-between border-t border-gray-200 px-4 sm:px-0">
        {hasPreviousPage && previousPageCursor && (
          <div className="-mt-px flex w-0 flex-1">
            <Link
              href={`/users/${user}?cursor=${encodeURIComponent(previousPageCursor)}`}
              className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              <ArrowLongLeftIcon
                className="mr-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              Previous
            </Link>
          </div>
        )}
        {hasNextPage && nextPageCursor && (
          <div className="-mt-px flex w-0 flex-1 justify-end">
            <Link
              href={`/users/${user}?cursor=${encodeURIComponent(nextPageCursor)}`}
              className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Next
              <ArrowLongRightIcon
                className="ml-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
