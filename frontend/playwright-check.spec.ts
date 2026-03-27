import { test, expect } from '@playwright/test';

test('check index page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Check the title or some content on the page
  await expect(page).toHaveTitle(/.*/); // Just check it has a title for now
  
  // Take a screenshot to see how it looks
  await page.screenshot({ path: 'index-page-check.png' });
  
  // Check for some common elements if possible, e.g., a heading
  // Since I don't know the content yet, I'll just log the title
  const title = await page.title();
  console.log('Page title:', title);
});
