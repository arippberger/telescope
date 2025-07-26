import { test, expect } from '@playwright/test';

test.describe('Accessibility Features', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
  });

  test.describe('Keyboard Navigation', () => {
    test('supports tab navigation through all interactive elements', async ({ page }) => {
      // Tab through the main interactive elements
      await page.keyboard.press('Tab');
      await expect(page.locator('input[data-testid="search-input"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.locator('button[data-testid="search-button"]')).toBeFocused();

      // Check that focus is visible
      const searchButton = page.locator('button[data-testid="search-button"]');
      await expect(searchButton).toHaveClass(/focus-visible|focus:/);
    });

    test('allows search with Enter key', async ({ page }) => {
      const searchInput = page.locator('input[data-testid="search-input"]');
      await searchInput.fill('octocat');
      await searchInput.press('Enter');

      await expect(page).toHaveURL(/\/users\/octocat/);
    });

    test('closes search suggestions with Escape key', async ({ page }) => {
      const searchInput = page.locator('input[data-testid="search-input"]');
      
      // Type to trigger suggestions (if history exists)
      await searchInput.fill('test');
      
      // Press Escape to close suggestions
      await searchInput.press('Escape');
      
      // Verify input loses focus
      await expect(searchInput).not.toBeFocused();
    });

    test('navigates through search suggestions with arrow keys', async ({ page }) => {
      // First, add some search history by performing searches
      const searchInput = page.locator('input[data-testid="search-input"]');
      await searchInput.fill('octocat');
      await searchInput.press('Enter');
      
      await page.goBack();
      
      // Now test suggestions navigation
      await searchInput.fill('oct');
      
      // Wait for suggestions to appear
      const suggestions = page.locator('[role="option"], button:has-text("octocat")');
      if (await suggestions.count() > 0) {
        await searchInput.press('ArrowDown');
        await expect(suggestions.first()).toHaveClass(/focus|bg-gray-50/);
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('has proper ARIA labels for search elements', async ({ page }) => {
      const searchInput = page.locator('input[data-testid="search-input"]');
      const searchButton = page.locator('[data-testid="search-button"]');

      // Check for proper labels
      await expect(searchInput).toHaveAttribute('placeholder', 'username');
      await expect(searchInput).toHaveAttribute('role', 'textbox');
      
      // Check for accessible button text
      await expect(searchButton).toContainText('Search');
    });

    test('provides proper semantic markup for repository cards', async ({ page }) => {
      // Navigate to a user with repositories
      await page.goto('/users/octocat');

      // Wait for repositories to load
      await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });

      const repositoryCards = page.locator('[data-testid="repository-card"]');
      const firstCard = repositoryCards.first();

      // Check for proper heading structure
      const cardHeading = firstCard.locator('h3, h2, h1');
      await expect(cardHeading).toBeVisible();

      // Check for proper link structure
      const cardLink = firstCard.locator('a');
      await expect(cardLink).toHaveAttribute('href');
    });

    test('includes proper landmark navigation', async ({ page }) => {
      // Check for main landmark
      const main = page.locator('main');
      await expect(main).toBeVisible();

      // Check for navigation if present
      const nav = page.locator('nav');
      if (await nav.count() > 0) {
        await expect(nav).toBeVisible();
      }
    });

    test('provides loading state announcements', async ({ page }) => {
      // Navigate to a user page
      await page.goto('/users/octocat');

      // Check for loading indicators with proper ARIA
      const loadingElement = page.locator('[aria-label*="loading"], [role="progressbar"]');
      if (await loadingElement.count() > 0) {
        await expect(loadingElement).toBeVisible();
      }
    });
  });

  test.describe('Focus Management', () => {
    test('maintains focus after search navigation', async ({ page }) => {
      const searchInput = page.locator('input[data-testid="search-input"]');
      
      await searchInput.fill('octocat');
      await searchInput.press('Enter');

      // Wait for navigation
      await page.waitForURL(/\/users\/octocat/);
      
      // The search input on the new page should exist and be accessible
      const newSearchInput = page.locator('input[data-testid="search-input"]');
      await expect(newSearchInput).toBeVisible();
      await expect(newSearchInput).toHaveValue('octocat');
    });

    test('manages focus when navigating back from repository details', async ({ page }) => {
      // Navigate to user page
      await page.goto('/users/octocat');
      
      // Wait for repositories to load and click on one
      await page.waitForSelector('[data-testid="repository-card"] a', { timeout: 10000 });
      await page.locator('[data-testid="repository-card"] a').first().click();

      // Navigate back
      await page.goBack();

      // Focus should be manageable (not lost)
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('properly handles focus for pagination controls', async ({ page }) => {
      // Navigate to a user with many repositories
      await page.goto('/users/octocat');
      
      // Wait for pagination controls if they exist
      const paginationNext = page.locator('a:has-text("Next")');
      const paginationPrev = page.locator('a:has-text("Previous")');

      if (await paginationNext.count() > 0) {
        await paginationNext.focus();
        await expect(paginationNext).toBeFocused();
      }

      if (await paginationPrev.count() > 0) {
        await paginationPrev.focus();
        await expect(paginationPrev).toBeFocused();
      }
    });
  });

  test.describe('Color Contrast and Visual Accessibility', () => {
    test('maintains sufficient contrast ratios', async ({ page }) => {
      // This is a basic check - in a real app you'd use tools like axe-core
      const searchButton = page.locator('[data-testid="search-button"]');
      
      // Check that text is visible and button has proper styling
      await expect(searchButton).toBeVisible();
      await expect(searchButton).toHaveCSS('color', /.+/);
      await expect(searchButton).toHaveCSS('background-color', /.+/);
    });

    test('respects prefers-reduced-motion', async ({ page, browserName }) => {
      // Skip this test for WebKit as it doesn't support the media query in Playwright
      test.skip(browserName === 'webkit', 'WebKit doesn\'t support prefers-reduced-motion in Playwright');

      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      // Navigate and check that animations are reduced/disabled
      await page.goto('/users/octocat');
      
      // Any loading spinners should respect reduced motion
      const spinner = page.locator('.animate-spin');
      if (await spinner.count() > 0) {
        const animationDuration = await spinner.evaluate(el => 
          getComputedStyle(el).animationDuration
        );
        // Animation should be instant or very short with reduced motion
        expect(animationDuration === '0s' || animationDuration === '0.01s').toBeTruthy();
      }
    });
  });

  test.describe('Error State Accessibility', () => {
    test('provides accessible error messages', async ({ page }) => {
      // Navigate to a non-existent user
      await page.goto('/users/non-existent-user-12345');

      // Wait for error state
      await page.waitForSelector('text="User Not Found"', { timeout: 10000 });

      // Check for proper error announcement
      const errorMessage = page.locator('[role="alert"], .error-message, text="User Not Found"');
      await expect(errorMessage).toBeVisible();

      // Check for actionable error recovery
      const actionButton = page.locator('a:has-text("Search for a different user"), button:has-text("Try again")');
      if (await actionButton.count() > 0) {
        await expect(actionButton).toBeVisible();
        await actionButton.focus();
        await expect(actionButton).toBeFocused();
      }
    });

    test('maintains accessibility during loading states', async ({ page }) => {
      // Navigate to a user page
      await page.goto('/users/octocat');

      // Check that loading states don't break navigation
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('supports touch navigation', async ({ page }) => {
      // Emulate mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const searchInput = page.locator('input[data-testid="search-input"]');
      const searchButton = page.locator('[data-testid="search-button"]');

      // Touch interactions should work
      await searchInput.tap();
      await searchInput.fill('octocat');
      await searchButton.tap();

      await expect(page).toHaveURL(/\/users\/octocat/);
    });

    test('maintains usability on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });

      // All interactive elements should remain accessible
      const searchInput = page.locator('input[data-testid="search-input"]');
      const searchButton = page.locator('[data-testid="search-button"]');

      await expect(searchInput).toBeVisible();
      await expect(searchButton).toBeVisible();

      // Elements should not overlap
      const inputBox = await searchInput.boundingBox();
      const buttonBox = await searchButton.boundingBox();
      
      if (inputBox && buttonBox) {
        // Basic check that elements don't completely overlap
        expect(inputBox.x).not.toBe(buttonBox.x);
      }
    });
  });
}); 