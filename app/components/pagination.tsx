import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

interface Props {
  handleNextPage: any;
  handlePreviousPage: any;
  nextPage?: string;
  previousPage?: string;
}

export default function Pagination(props: Props) {
  const handleNextPage = (event: any) => {
    event.preventDefault();
    props.handleNextPage(props.nextPage);
  };

  const handlePreviousPage = (event: any) => {
    event.preventDefault();
    props.handlePreviousPage(props.previousPage);
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <nav className="flex flex-1 items-center justify-between border-t border-gray-200 px-4 sm:px-0">
        {props.previousPage && (
          <div className="-mt-px flex w-0 flex-1">
            <a
              href="#"
              onClick={handlePreviousPage}
              className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              <ArrowLongLeftIcon
                className="mr-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              Previous
            </a>
          </div>
        )}
        {props.nextPage && (
          <div className="-mt-px flex w-0 flex-1 justify-end">
            <a
              href="#"
              onClick={handleNextPage}
              className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Next
              <ArrowLongRightIcon
                className="ml-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </a>
          </div>
        )}
      </nav>
    </div>
  );
}
