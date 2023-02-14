"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="center-text p-8">
      <h1
        role="heading"
        aria-label="Error Heading"
        className="text-3xl font-bold underline"
      >
        Error
      </h1>
      <p role="alert" aria-label="Error Message" className="text-red-500 my-4">
        {error.message}
      </p>
      <button
        className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        role="button"
        aria-label="Reset Error"
        onClick={() => reset()}
      >
        Reset
      </button>
    </main>
  );
}
