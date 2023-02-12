'use client';

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main>
            <h1 role="heading" aria-label="Error Heading" className="text-3xl font-bold underline">
                Error {error.message}
            </h1>
            <button role="button" aria-label="Reset Error" onClick={() => reset()}>Reset</button>
        </main>
    )
}
