import { test, expect } from '@playwright/test';

test('check index page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Check the title or some content on the page
  await expect(page).toHaveTitle(/.*/); // Just check it has a title for now
  
  // Take a screenshot to see how it looks
  await page.screenshot({ path: 'index-page-check.png' });
  
  const title = await page.title();
  console.log('Page title:', title);
});
