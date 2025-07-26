import { renderHook, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useSearch, useSearchSuggestions } from '../../app/hooks/use-search';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useSearch Hook', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Basic Functionality', () => {
    it('initializes with default values', () => {
      const { result } = renderHook(() => useSearch());

      expect(result.current.searchQuery).toBe('');
      expect(result.current.debouncedQuery).toBe('');
      expect(result.current.isSearching).toBe(false);
      expect(result.current.searchHistory).toEqual([]);
    });

    it('initializes with provided initial query', () => {
      const { result } = renderHook(() => useSearch('initial-query'));

      expect(result.current.searchQuery).toBe('initial-query');
      expect(result.current.debouncedQuery).toBe('initial-query');
    });

    it('updates search query', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setSearchQuery('test-query');
      });

      expect(result.current.searchQuery).toBe('test-query');
      expect(result.current.isSearching).toBe(true);
    });
  });

  describe('Debouncing', () => {
    it('debounces query updates', () => {
      const { result } = renderHook(() => useSearch('', { debounceMs: 500 }));

      act(() => {
        result.current.setSearchQuery('test');
      });

      expect(result.current.isSearching).toBe(true);
      expect(result.current.debouncedQuery).toBe('');

      // Fast forward time but not enough
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.isSearching).toBe(true);
      expect(result.current.debouncedQuery).toBe('');

      // Complete the debounce
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(result.current.isSearching).toBe(false);
      expect(result.current.debouncedQuery).toBe('test');
    });

    it('resets debounce timer on new input', () => {
      const { result } = renderHook(() => useSearch('', { debounceMs: 300 }));

      act(() => {
        result.current.setSearchQuery('test');
      });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      // New input before debounce completes
      act(() => {
        result.current.setSearchQuery('testing');
      });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Should still be searching, timer was reset
      expect(result.current.isSearching).toBe(true);
      expect(result.current.debouncedQuery).toBe('');

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.isSearching).toBe(false);
      expect(result.current.debouncedQuery).toBe('testing');
    });
  });

  describe('Search History', () => {
    it('loads history from localStorage on mount', () => {
      const savedHistory = ['user1', 'user2'];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedHistory));

      const { result } = renderHook(() => useSearch());

      expect(result.current.searchHistory).toEqual(savedHistory);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('telescope_search_history');
    });

    it('handles invalid localStorage data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      const { result } = renderHook(() => useSearch());

      expect(result.current.searchHistory).toEqual([]);
    });

    it('handles localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const { result } = renderHook(() => useSearch());

      expect(result.current.searchHistory).toEqual([]);
    });

    it('saves history to localStorage when performing search', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleSearch('test-user');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'telescope_search_history',
        JSON.stringify(['test-user'])
      );
    });

    it('adds new searches to beginning of history', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['old-user']));

      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleSearch('new-user');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'telescope_search_history',
        JSON.stringify(['new-user', 'old-user'])
      );
    });

    it('removes duplicates from history', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['user1', 'user2', 'user3']));

      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleSearch('user2');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'telescope_search_history',
        JSON.stringify(['user2', 'user1', 'user3'])
      );
    });

    it('limits history to maximum items', () => {
      const longHistory = Array.from({ length: 12 }, (_, i) => `user${i}`);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(longHistory));

      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleSearch('new-user');
      });

      const savedHistory = JSON.parse(
        (localStorageMock.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(savedHistory).toHaveLength(10);
      expect(savedHistory[0]).toBe('new-user');
    });

    it('clears history', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['user1', 'user2']));

      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.searchHistory).toEqual([]);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('telescope_search_history');
    });

    it('removes specific item from history', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['user1', 'user2', 'user3']));

      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.removeFromHistory('user2');
      });

      expect(result.current.searchHistory).toEqual(['user1', 'user3']);
    });

    it('can disable history functionality', () => {
      const { result } = renderHook(() => useSearch('', { enableHistory: false }));

      act(() => {
        result.current.handleSearch('test-user');
      });

      expect(result.current.searchHistory).toEqual([]);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Search Execution', () => {
    it('navigates to user page on search', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleSearch('test-user');
      });

      expect(mockPush).toHaveBeenCalledWith('/users/test-user');
    });

    it('uses current query if no parameter provided', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setSearchQuery('current-user');
      });

      act(() => {
        result.current.handleSearch();
      });

      expect(mockPush).toHaveBeenCalledWith('/users/current-user');
    });

    it('trims whitespace from search query', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleSearch('  test-user  ');
      });

      expect(mockPush).toHaveBeenCalledWith('/users/test-user');
    });

    it('does not search with empty query', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleSearch('   ');
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('properly encodes URL parameters', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleSearch('user@domain.com');
      });

      expect(mockPush).toHaveBeenCalledWith('/users/user%40domain.com');
    });

    it('calls onSearch callback when provided', () => {
      const onSearchMock = jest.fn();
      const { result } = renderHook(() => useSearch('', { onSearch: onSearchMock }));

      act(() => {
        result.current.handleSearch('test-user');
      });

      expect(onSearchMock).toHaveBeenCalledWith('test-user');
    });
  });
});

describe('useSearchSuggestions Hook', () => {
  it('returns empty suggestions for empty query', () => {
    const { result } = renderHook(() => 
      useSearchSuggestions('', ['user1', 'user2'])
    );

    expect(result.current).toEqual([]);
  });

  it('filters suggestions based on query', () => {
    const history = ['octocat', 'github', 'octopus', 'cat'];
    
    const { result } = renderHook(() => 
      useSearchSuggestions('oct', history)
    );

    expect(result.current).toEqual(['octocat', 'octopus']);
  });

  it('excludes exact matches from suggestions', () => {
    const history = ['octocat', 'github'];
    
    const { result } = renderHook(() => 
      useSearchSuggestions('octocat', history)
    );

    expect(result.current).toEqual([]);
  });

  it('limits suggestions to 5 items', () => {
    const history = Array.from({ length: 10 }, (_, i) => `test${i}`);
    
    const { result } = renderHook(() => 
      useSearchSuggestions('test', history)
    );

    expect(result.current).toHaveLength(5);
  });

  it('performs case-insensitive filtering', () => {
    const history = ['GitHub', 'OCTOCAT', 'github-user'];
    
    const { result } = renderHook(() => 
      useSearchSuggestions('git', history)
    );

    expect(result.current).toEqual(['GitHub', 'github-user']);
  });

  it('updates suggestions when query changes', () => {
    const history = ['javascript', 'java', 'python'];
    
    const { result, rerender } = renderHook(
      ({ query }) => useSearchSuggestions(query, history),
      { initialProps: { query: 'java' } }
    );

    expect(result.current).toEqual(['javascript', 'java']);

    rerender({ query: 'script' });

    expect(result.current).toEqual(['javascript']);
  });

  it('updates suggestions when history changes', () => {
    const { result, rerender } = renderHook(
      ({ history }) => useSearchSuggestions('user', history),
      { initialProps: { history: ['user1', 'user2'] } }
    );

    expect(result.current).toEqual(['user1', 'user2']);

    rerender({ history: ['user1', 'user2', 'user3'] });

    expect(result.current).toEqual(['user1', 'user2', 'user3']);
  });
}); 