import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import HomeSearch from '../../app/components/home-search';
import Search from '../../app/components/search';

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

describe('Search Flow Integration', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('HomeSearch Component', () => {
    it('completes the full search flow from input to navigation', async () => {
      const user = userEvent.setup();
      render(<HomeSearch />);

      const input = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      // Initially search button should be disabled
      expect(searchButton).toBeDisabled();

      // Type a username
      await user.type(input, 'octocat');
      
      // Button should now be enabled
      expect(searchButton).not.toBeDisabled();

      // Click search button
      await user.click(searchButton);

      // Should navigate to user page
      expect(mockPush).toHaveBeenCalledWith('/users/octocat');
    });

    it('handles Enter key to trigger search', async () => {
      const user = userEvent.setup();
      render(<HomeSearch />);

      const input = screen.getByTestId('search-input');

      await user.type(input, 'octocat');
      await user.keyboard('{Enter}');

      expect(mockPush).toHaveBeenCalledWith('/users/octocat');
    });

    it('handles Escape key to close suggestions', async () => {
      const user = userEvent.setup();
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['previous-user']));
      
      render(<HomeSearch />);

      const input = screen.getByTestId('search-input');

      // Focus input to show suggestions
      await user.click(input);

      // Should show recent searches
      await waitFor(() => {
        expect(screen.getByText('Recent Searches')).toBeInTheDocument();
      });

      // Press Escape
      await user.keyboard('{Escape}');

      // Suggestions should be hidden
      await waitFor(() => {
        expect(screen.queryByText('Recent Searches')).not.toBeInTheDocument();
      });
    });

    it('does not search with empty input', async () => {
      const user = userEvent.setup();
      render(<HomeSearch />);

      const searchButton = screen.getByTestId('search-button');

      // Try to click search with empty input
      expect(searchButton).toBeDisabled();

      // Should not navigate
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('trims whitespace from search input', async () => {
      const user = userEvent.setup();
      render(<HomeSearch />);

      const input = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      await user.type(input, '  octocat  ');
      await user.click(searchButton);

      expect(mockPush).toHaveBeenCalledWith('/users/octocat');
    });
  });

  describe('Search Component', () => {
    it('initializes with provided search value', () => {
      render(<Search searchValue="testuser" />);
      
      const input = screen.getByTestId('search-input');
      expect(input).toHaveValue('testuser');
    });

    it('updates input and navigates on search', async () => {
      const user = userEvent.setup();
      render(<Search searchValue="initial" />);

      const input = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      // Clear and type new value
      await user.clear(input);
      await user.type(input, 'newuser');

      await user.click(searchButton);

      expect(mockPush).toHaveBeenCalledWith('/users/newuser');
    });

    it('properly encodes special characters in URLs', async () => {
      const user = userEvent.setup();
      render(<Search searchValue="" />);

      const input = screen.getByTestId('search-input');
      await user.type(input, 'user@example');

      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockPush).toHaveBeenCalledWith('/users/user%40example');
    });
  });

  describe('Search History Integration', () => {
    it('saves and loads search history', async () => {
      const user = userEvent.setup();
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['previous-search']));

      render(<HomeSearch />);

      const input = screen.getByTestId('search-input');
      
      // Focus to show history
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Recent Searches')).toBeInTheDocument();
        expect(screen.getByText('previous-search')).toBeInTheDocument();
      });

      // Perform new search
      await user.type(input, 'new-search');
      await user.keyboard('{Enter}');

      // Should save to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'telescope_search_history',
        JSON.stringify(['new-search', 'previous-search'])
      );
    });

    it('handles localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      // Should not crash when localStorage fails
      expect(() => render(<HomeSearch />)).not.toThrow();
    });

    it('allows clearing search history', async () => {
      const user = userEvent.setup();
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['test1', 'test2']));

      render(<HomeSearch />);

      const input = screen.getByTestId('search-input');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Recent Searches')).toBeInTheDocument();
      });

      const clearButton = screen.getByText('Clear');
      await user.click(clearButton);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('telescope_search_history');
    });

    it('limits history to maximum items', async () => {
      const user = userEvent.setup();
      const longHistory = Array.from({ length: 15 }, (_, i) => `user${i}`);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(longHistory));

      render(<HomeSearch />);

      const input = screen.getByTestId('search-input');
      await user.type(input, 'newuser');
      await user.keyboard('{Enter}');

      // Should save only 10 items (MAX_HISTORY_ITEMS)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'telescope_search_history',
        expect.stringContaining('newuser')
      );

      const savedHistory = JSON.parse(
        (localStorageMock.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(savedHistory).toHaveLength(10);
      expect(savedHistory[0]).toBe('newuser');
    });
  });

  describe('Search Suggestions', () => {
    it('shows suggestions based on search history', async () => {
      const user = userEvent.setup();
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(['octocat', 'github', 'octopus'])
      );

      render(<HomeSearch />);

      const input = screen.getByTestId('search-input');
      await user.type(input, 'oct');

      await waitFor(() => {
        expect(screen.getByText('Suggestions')).toBeInTheDocument();
        expect(screen.getByText('octocat')).toBeInTheDocument();
        expect(screen.getByText('octopus')).toBeInTheDocument();
        expect(screen.queryByText('github')).not.toBeInTheDocument();
      });
    });

    it('allows clicking on suggestions to search', async () => {
      const user = userEvent.setup();
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['octocat']));

      render(<HomeSearch />);

      const input = screen.getByTestId('search-input');
      await user.type(input, 'oct');

      await waitFor(() => {
        expect(screen.getByText('octocat')).toBeInTheDocument();
      });

      await user.click(screen.getByText('octocat'));

      expect(mockPush).toHaveBeenCalledWith('/users/octocat');
    });
  });
}); 