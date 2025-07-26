"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useSearch, useSearchSuggestions } from "../hooks/use-search";

interface Props {
  searchValue: string;
}

export default function Search({ searchValue }: Props) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const {
    searchQuery,
    isSearching,
    searchHistory,
    setSearchQuery,
    handleSearch,
    clearHistory
  } = useSearch(searchValue);

  const suggestions = useSearchSuggestions(searchQuery, searchHistory);

  useEffect(() => {
    setSearchQuery(searchValue);
  }, [searchValue, setSearchQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setShowSuggestions(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
      setShowSuggestions(false);
      inputRef.current?.blur();
    } else if (event.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    setShowSuggestions(suggestions.length > 0 || searchHistory.length > 0);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-x-6">
        <div className="flex min-w-0 gap-x-4 relative">
          <input
            ref={inputRef}
            data-testid="search-input"
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-4 pr-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            type="text"
            placeholder="username"
            value={searchQuery}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            autoComplete="off"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
          )}
          
          {/* Search Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
              {suggestions.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                    Suggestions
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`suggestion-${index}`}
                      className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              
              {searchHistory.length > 0 && suggestions.length === 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b flex justify-between items-center">
                    Recent Searches
                    <button
                      onClick={clearHistory}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Clear
                    </button>
                  </div>
                  {searchHistory.slice(0, 5).map((item, index) => (
                    <button
                      key={`history-${index}`}
                      className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <Link
          ref={buttonRef}
          data-testid="search-button"
          href={searchQuery ? `/users/${encodeURIComponent(searchQuery)}` : "/"}
          className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        >
          <span>Search</span>
        </Link>
      </div>
    </div>
  );
}
