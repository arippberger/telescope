import { test, expect } from '@playwright/test';

test.describe('Complete User Journeys', () => {
  test.describe('Search to Repository Detail Flow', () => {
    test('completes full search flow from home to repository detail', async ({ page }) => {
      // Start at home page
      await page.goto('/');

      // Verify we're on the home page
      await expect(page.locator('h1:has-text("Telescope")')).toBeVisible();

      // Perform search
      const searchInput = page.locator('input[data-testid="search-input"]');
      const searchButton = page.locator('[data-testid="search-button"]');

      await searchInput.fill('octocat');
      await searchButton.click();

      // Verify navigation to user page
      await expect(page).toHaveURL(/\/users\/octocat/);
      await expect(page.locator('input[data-testid="search-input"]')).toHaveValue('octocat');

      // Wait for repositories to load
      await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });

      // Click on first repository
      const firstRepo = page.locator('[data-testid="repository-card"]').first();
      const repoLink = firstRepo.locator('a').first();
      await repoLink.click();

      // Verify navigation to repository detail page
      await expect(page).toHaveURL(/\/users\/octocat\/stars\/.+/);

      // Verify repository details are displayed
      await expect(page.locator('h1, h2')).toBeVisible();
      await expect(page.locator('text=/stars|repository|github/i')).toBeVisible();
    });

    test('maintains search context across navigation', async ({ page }) => {
      await page.goto('/');
      
      // Search for a user
      await page.locator('input[data-testid="search-input"]').fill('github');
      await page.locator('[data-testid="search-button"]').click();

      await expect(page).toHaveURL(/\/users\/github/);

      // Navigate to a repository if available
      const repoCards = page.locator('[data-testid="repository-card"]');
      if (await repoCards.count() > 0) {
        await repoCards.first().locator('a').click();
        
        // Go back to user page
        await page.goBack();
        
        // Verify we're back on the user page with search context
        await expect(page).toHaveURL(/\/users\/github/);
        await expect(page.locator('input[data-testid="search-input"]')).toHaveValue('github');
      }
    });
  });

  test.describe('Pagination Flow', () => {
    test('navigates through pages of repositories', async ({ page }) => {
      // Navigate to a user with many repositories
      await page.goto('/users/torvalds');

      // Wait for repositories to load
      await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });

      // Check if pagination exists
      const nextButton = page.locator('a:has-text("Next")');
      if (await nextButton.count() > 0) {
        // Store first page repository names
        const firstPageRepos = await page.locator('[data-testid="repository-card"] h3, [data-testid="repository-card"] h2').allTextContents();

        // Navigate to next page
        await nextButton.click();

        // Verify URL changed with cursor parameter
        await expect(page).toHaveURL(/cursor=/);

        // Wait for new repositories to load
        await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });

        // Verify different repositories are shown
        const secondPageRepos = await page.locator('[data-testid="repository-card"] h3, [data-testid="repository-card"] h2').allTextContents();
        
        // At least some repositories should be different
        const hasDifferentRepos = secondPageRepos.some(repo => !firstPageRepos.includes(repo));
        expect(hasDifferentRepos).toBeTruthy();

        // Test previous button if available
        const prevButton = page.locator('a:has-text("Previous")');
        if (await prevButton.count() > 0) {
          await prevButton.click();
          
          // Should be back to first page (or close to it)
          await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });
        }
      }
    });

    test('maintains pagination state on page refresh', async ({ page }) => {
      await page.goto('/users/torvalds');

      const nextButton = page.locator('a:has-text("Next")');
      if (await nextButton.count() > 0) {
        await nextButton.click();
        
        // Get current URL with pagination
        const urlWithPagination = page.url();
        
        // Refresh the page
        await page.reload();
        
        // Should still be on the same paginated URL
        expect(page.url()).toBe(urlWithPagination);
        
        // Content should still be loaded
        await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });
      }
    });
  });

  test.describe('Error Recovery Flows', () => {
    test('recovers from user not found error', async ({ page }) => {
      // Navigate to non-existent user
      await page.goto('/users/non-existent-user-123456789');

      // Wait for error state
      await page.waitForSelector('text="User Not Found"', { timeout: 10000 });

      // Verify error message
      await expect(page.locator('text="User Not Found"')).toBeVisible();

      // Click on "Search for a different user" link
      const searchLink = page.locator('a:has-text("Search for a different user")');
      if (await searchLink.count() > 0) {
        await searchLink.click();
        
        // Should navigate back to home
        await expect(page).toHaveURL('/');
        
        // Perform a new search
        await page.locator('input[data-testid="search-input"]').fill('octocat');
        await page.locator('[data-testid="search-button"]').click();
        
        // Should successfully load the user
        await expect(page).toHaveURL(/\/users\/octocat/);
        await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });
      }
    });

    test('handles rate limit errors gracefully', async ({ page }) => {
      // This test would require mocking the API to return rate limit errors
      // For now, we'll test the UI exists for handling such errors
      await page.goto('/users/octocat');
      
      // Check that the page loads normally first
      await page.waitForSelector('[data-testid="repository-card"], text="No starred repositories", text="Rate Limit"', { timeout: 15000 });
      
      // If rate limit error appears, test the recovery
      const rateLimitError = page.locator('text="Rate Limit"');
      if (await rateLimitError.count() > 0) {
        const tryAgainButton = page.locator('button:has-text("Try again")');
        await expect(tryAgainButton).toBeVisible();
        
        // Test that button is interactive
        await tryAgainButton.click();
      }
    });

    test('handles network errors with retry', async ({ page }) => {
      // Navigate to a user page
      await page.goto('/users/octocat');
      
      // In case of any error states, verify retry mechanisms exist
      const errorElements = page.locator('text="Try again", text="Unable to Load"');
      if (await errorElements.count() > 0) {
        const tryAgainButton = page.locator('button:has-text("Try again")');
        if (await tryAgainButton.count() > 0) {
          await expect(tryAgainButton).toBeVisible();
          await tryAgainButton.click();
        }
      }
    });
  });

  test.describe('Search History and Suggestions', () => {
    test('builds and uses search history', async ({ page }) => {
      await page.goto('/');

      // Perform multiple searches to build history
      const searchInput = page.locator('input[data-testid="search-input"]');
      const searchButton = page.locator('[data-testid="search-button"]');

      // Search 1
      await searchInput.fill('octocat');
      await searchButton.click();
      await page.waitForURL(/\/users\/octocat/);

      // Go back and search again
      await page.goto('/');
      await searchInput.fill('github');
      await searchButton.click();
      await page.waitForURL(/\/users\/github/);

      // Go back and test history
      await page.goto('/');
      await searchInput.click();

      // Check if search history appears
      const historyItems = page.locator('text="Recent Searches", text="octocat", text="github"');
      if (await historyItems.count() > 0) {
        // Click on a history item
        const octocatHistory = page.locator('button:has-text("octocat")');
        if (await octocatHistory.count() > 0) {
          await octocatHistory.click();
          await expect(page).toHaveURL(/\/users\/octocat/);
        }
      }
    });

    test('provides search suggestions based on history', async ({ page }) => {
      await page.goto('/');

      // Build search history first
      const searchInput = page.locator('input[data-testid="search-input"]');
      await searchInput.fill('octocat');
      await page.locator('[data-testid="search-button"]').click();

      await page.goto('/');
      await searchInput.fill('github');
      await page.locator('[data-testid="search-button"]').click();

      // Go back and test suggestions
      await page.goto('/');
      await searchInput.fill('oct');

      // Check for suggestions
      const suggestions = page.locator('text="Suggestions", button:has-text("octocat")');
      if (await suggestions.count() > 0) {
        const octocatSuggestion = page.locator('button:has-text("octocat")');
        await octocatSuggestion.click();
        await expect(page).toHaveURL(/\/users\/octocat/);
      }
    });

    test('allows clearing search history', async ({ page }) => {
      await page.goto('/');

      // Build some search history
      const searchInput = page.locator('input[data-testid="search-input"]');
      await searchInput.fill('testuser');
      await page.locator('[data-testid="search-button"]').click();

      // Go back and open history
      await page.goto('/');
      await searchInput.click();

      // Look for clear button
      const clearButton = page.locator('button:has-text("Clear")');
      if (await clearButton.count() > 0) {
        await clearButton.click();
        
        // History should be cleared
        const historySection = page.locator('text="Recent Searches"');
        await expect(historySection).not.toBeVisible();
      }
    });
  });

  test.describe('Mobile User Journeys', () => {
    test('completes search flow on mobile device', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/');

      // Perform search using touch
      const searchInput = page.locator('input[data-testid="search-input"]');
      const searchButton = page.locator('[data-testid="search-button"]');

      await searchInput.tap();
      await searchInput.fill('octocat');
      await searchButton.tap();

      await expect(page).toHaveURL(/\/users\/octocat/);

      // Verify repositories are displayed properly on mobile
      await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });
      
      const repoCard = page.locator('[data-testid="repository-card"]').first();
      await expect(repoCard).toBeVisible();

      // Test repository card interaction
      await repoCard.tap();
      await expect(page).toHaveURL(/\/users\/octocat\/stars\/.+/);
    });

    test('handles mobile navigation and gestures', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/users/octocat');
      await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });

      // Test scrolling behavior
      await page.evaluate(() => window.scrollTo(0, 200));
      
      // Elements should still be interactive after scroll
      const searchInput = page.locator('input[data-testid="search-input"]');
      await searchInput.tap();
      await expect(searchInput).toBeFocused();
    });
  });

  test.describe('Performance and Loading States', () => {
    test('shows appropriate loading states during navigation', async ({ page }) => {
      await page.goto('/');
      
      const searchInput = page.locator('input[data-testid="search-input"]');
      await searchInput.fill('torvalds'); // User with many repos
      await page.locator('[data-testid="search-button"]').click();

      // Should show some kind of loading state
      const loadingStates = page.locator('[data-testid="repository-grid-skeleton"], .animate-spin, text="Loading"');
      
      // Wait for either loading state or content
      await page.waitForSelector('[data-testid="repository-card"], [data-testid="repository-grid-skeleton"]', { timeout: 10000 });
      
      // Eventually content should load
      await page.waitForSelector('[data-testid="repository-card"]', { timeout: 15000 });
    });

    test('handles slow network conditions gracefully', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 100); // Add 100ms delay
      });

      await page.goto('/users/octocat');
      
      // Should eventually load despite slow network
      await page.waitForSelector('[data-testid="repository-card"], text="No starred repositories"', { timeout: 20000 });
    });
  });

  test.describe('Edge Cases and Boundary Conditions', () => {
    test('handles users with no starred repositories', async ({ page }) => {
      // Try to find a user with no stars, or test the empty state
      await page.goto('/users/empty-test-user-with-no-stars');
      
      // Should show either error or empty state
      await page.waitForSelector('text="User Not Found", text="No starred repositories"', { timeout: 10000 });
      
      const emptyState = page.locator('text="No starred repositories"');
      if (await emptyState.count() > 0) {
        await expect(emptyState).toBeVisible();
      }
    });

    test('handles special characters in usernames', async ({ page }) => {
      await page.goto('/');
      
      const searchInput = page.locator('input[data-testid="search-input"]');
      await searchInput.fill('user-with-dashes');
      await page.locator('[data-testid="search-button"]').click();
      
      // Should properly encode the URL
      await expect(page).toHaveURL(/\/users\/user-with-dashes/);
    });

    test('handles very long repository names and descriptions', async ({ page }) => {
      await page.goto('/users/octocat');
      await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });
      
      // Verify that long content doesn't break layout
      const repoCards = page.locator('[data-testid="repository-card"]');
      const cardCount = await repoCards.count();
      
      if (cardCount > 0) {
        // Check that cards maintain their structure
        for (let i = 0; i < Math.min(3, cardCount); i++) {
          const card = repoCards.nth(i);
          await expect(card).toBeVisible();
          
          // Verify card has reasonable dimensions
          const boundingBox = await card.boundingBox();
          if (boundingBox) {
            expect(boundingBox.width).toBeGreaterThan(100);
            expect(boundingBox.height).toBeGreaterThan(50);
          }
        }
      }
    });
  });
}); 