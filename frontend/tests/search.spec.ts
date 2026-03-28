import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should allow searching from the homepage', async ({ page }) => {
    // 1. Go to the homepage
    await page.goto('http://localhost:3000/');

    // 2. Check for the title
    await expect(page).toHaveTitle(/Data4OOV/);

    // 3. Find the search input and type a query
    const searchInput = page.getByPlaceholder('Doorzoek de Data4OOV catalogus');
    await searchInput.fill('water');

    // 4. Click the search button
    await page.getByRole('button', { name: 'Zoeken' }).click();

    // 5. Verify navigation to the results page
    await page.waitForURL(/\/dataset\?q=water/);
    
    // 6. Check that the query is preserved in the search results page input
    const resultsSearchInput = page.getByPlaceholder('Doorzoek de Data4OOV catalogus');
    await expect(resultsSearchInput).toHaveValue('water');

    // 7. Check for results heading (optional, depends on if CKAN is up)
    // await expect(page.getByRole('heading', { name: /gevonden met: water/i })).toBeVisible();
  });

  test('should update search results when searching again from results page', async ({ page }) => {
    // 1. Go directly to a search result page
    await page.goto('http://localhost:3000/dataset?q=water');

    // 2. Clear and type a new query
    const searchInput = page.getByPlaceholder('Doorzoek de Data4OOV catalogus');
    await searchInput.fill('brand');
    await page.getByRole('button', { name: 'Zoeken' }).click();

    // 3. Verify navigation to the new query
    await page.waitForURL(/\/dataset\?q=brand/);
    await expect(searchInput).toHaveValue('brand');
  });
});
