'use client';

import { use, useState } from 'react';
import Search from "./search";
import Stars from "./stars";

async function getUserStars() {
    const response = await fetch('https://api.github.com/users/arippberger/starred');
    const data = await response.json();
    return data;
}

export default function SearchStars() {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchSubmit = (value: string) => {
        setSearchValue(value);
    };

    return (
        <>
            <Search searchSubmit={handleSearchSubmit} />
            {searchValue ? <Stars searchValue={searchValue} /> : null}
        </>
    )
}
