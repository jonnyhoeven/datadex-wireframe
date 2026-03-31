import { test, expect } from '@playwright/test';

test.describe('Predict Page Navigation', () => {
  test('should retain state on back/forward navigation', async ({ page }) => {
    // 1. Start at the homepage
    await page.goto('http://localhost:3000/');

    // 2. Navigate to the /predict page
    await page.click('text=Predict');
    await page.waitForURL('**/predict');

    // 3. Check that the "Betrokken Domeinen" select input is visible
    const domeinenSelect = page.locator('div:has-text("Betrokken Domeinen")').locator('div[class*="Select"]');
    await expect(domeinenSelect).toBeVisible();

    // 4. Check that it has a default value selected
    await expect(page.locator('text=brandweer')).toBeVisible();

    // 5. Navigate back to the homepage
    await page.goBack();
    await page.waitForURL('**/');

    // 6. Navigate forward to the /predict page
    await page.goForward();
    await page.waitForURL('**/predict');

    // 7. Check that the "Betrokken Domeinen" select input is still visible
    await expect(domeinenSelect).toBeVisible();

    // 8. Check that it still has the default value
    await expect(page.locator('text=brandweer')).toBeVisible();
  });
});
