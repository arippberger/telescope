'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface UseSearchOptions {
  debounceMs?: number;
  enableHistory?: boolean;
  onSearch?: (query: string) => void;
}

interface UseSearchResult {
  searchQuery: string;
  debouncedQuery: string;
  isSearching: boolean;
  searchHistory: string[];
  setSearchQuery: (query: string) => void;
  handleSearch: (query?: string) => void;
  clearHistory: () => void;
  removeFromHistory: (query: string) => void;
}

const STORAGE_KEY = 'telescope_search_history';
const MAX_HISTORY_ITEMS = 10;

export function useSearch(
  initialQuery: string = '',
  options: UseSearchOptions = {}
): UseSearchResult {
  const { debounceMs = 300, enableHistory = true, onSearch } = options;
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Load search history from localStorage on mount
  useEffect(() => {
    if (enableHistory && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const history = JSON.parse(saved);
          setSearchHistory(Array.isArray(history) ? history : []);
        }
      } catch (error) {
        console.warn('Failed to load search history:', error);
      }
    }
  }, [enableHistory]);

  // Save search history to localStorage when it changes
  useEffect(() => {
    if (enableHistory && typeof window !== 'undefined' && searchHistory.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory));
      } catch (error) {
        console.warn('Failed to save search history:', error);
      }
    }
  }, [searchHistory, enableHistory]);

  // Debounce search query updates
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, debounceMs);

    if (searchQuery !== debouncedQuery) {
      setIsSearching(true);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, debounceMs, debouncedQuery]);

  const addToHistory = useCallback((query: string) => {
    if (!enableHistory || !query.trim()) return;

    setSearchHistory(prev => {
      const trimmedQuery = query.trim();
      const filtered = prev.filter(item => item !== trimmedQuery);
      const newHistory = [trimmedQuery, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      return newHistory;
    });
  }, [enableHistory]);

  const handleSearch = useCallback((query?: string) => {
    const searchTerm = query !== undefined ? query : searchQuery;
    const trimmedTerm = searchTerm.trim();
    
    if (!trimmedTerm) return;

    // Add to history
    addToHistory(trimmedTerm);
    
    // Call custom onSearch callback if provided
    onSearch?.(trimmedTerm);
    
    // Navigate to search results
    router.push(`/users/${encodeURIComponent(trimmedTerm)}`);
  }, [searchQuery, addToHistory, onSearch, router]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const removeFromHistory = useCallback((query: string) => {
    setSearchHistory(prev => prev.filter(item => item !== query));
  }, []);

  return {
    searchQuery,
    debouncedQuery,
    isSearching,
    searchHistory,
    setSearchQuery,
    handleSearch,
    clearHistory,
    removeFromHistory,
  };
}

// Hook for managing search suggestions
export function useSearchSuggestions(query: string, history: string[]) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = history
      .filter(item => 
        item.toLowerCase().includes(query.toLowerCase()) && 
        item.toLowerCase() !== query.toLowerCase()
      )
      .slice(0, 5);
    
    setSuggestions(filtered);
  }, [query, history]);

  return suggestions;
} 