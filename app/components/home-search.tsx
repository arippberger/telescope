"use client";

import { MagnifyingGlassIcon, UsersIcon } from "@heroicons/react/20/solid";
import { useRef, useState } from "react";
import { useSearch, useSearchSuggestions } from "../hooks/use-search";

export default function HomeSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const {
    searchQuery,
    isSearching,
    searchHistory,
    setSearchQuery,
    handleSearch,
    clearHistory
  } = useSearch();

  const suggestions = useSearchSuggestions(searchQuery, searchHistory);

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

  const handleSearchClick = () => {
    handleSearch();
    setShowSuggestions(false);
  };

  return (
    <div className="mt-10 relative">
      <label htmlFor="user" className="block text-sm font-medium text-gray-700">
        Enter GitHub Username
      </label>
      <div className="mt-1 flex rounded-md shadow-sm relative">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <UsersIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            ref={inputRef}
            type="search"
            name="user"
            id="user"
            data-testid="search-input"
            role="textbox"
            className="block w-full rounded-none rounded-l-md border-gray-300 pl-10 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
            </div>
          )}
        </div>
        <button
          type="button"
          data-testid="search-button"
          onClick={handleSearchClick}
          disabled={!searchQuery.trim()}
          className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <span>Search</span>
        </button>
      </div>

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
  );
}
