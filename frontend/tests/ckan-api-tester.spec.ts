import { test, expect } from '@playwright/test';

test('CKAN API Tester page renders correctly', async ({ page }) => {
  await page.goto('/ckan');
  
  // Check for the main title
  await expect(page.getByText('API Toegang Data4OOV')).toBeVisible();
  
  // Check for the CKAN Backend badge
  await expect(page.getByText('CKAN Backend v3')).toBeVisible();
  
  // Check for the Interactive Console section
  await expect(page.getByText('Interactieve API Console')).toBeVisible();
  
  // Check for Method selector
  const methodSelect = page.locator('select');
  await expect(methodSelect).toBeVisible();
  await expect(methodSelect).toHaveValue('GET');
  
  // Check for Endpoint input
  const endpointInput = page.locator('input[type="text"]');
  await expect(endpointInput).toBeVisible();
  await expect(endpointInput).toHaveValue('package_show?id=water');
  
  // Check for the "Snel aan de slag" card
  await expect(page.getByText('Snel aan de slag')).toBeVisible();
  
  // Check for Code Examples
  await expect(page.getByText('Code Voorbeelden')).toBeVisible();
  await expect(page.getByRole('button', { name: 'JS' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'PYTHON' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'CURL' })).toBeVisible();
});

test('CKAN API Tester interactive console functionality', async ({ page }) => {
  await page.goto('/ckan');
  
  // Change method to POST
  await page.locator('select').selectOption('POST');
  
  // Verify Request Body textarea appears
  await expect(page.getByText('Request Body (JSON)')).toBeVisible();
  
  // Change endpoint
  await page.locator('input[type="text"]').fill('package_list');
  
  // Click Send Request
  await page.getByRole('button', { name: 'Send Request' }).click();
  
  // Note: Since this is a wireframe, actual API might not be reachable in test env, 
  // but we expect at least an attempt or a response display.
  // Given we are mocking/using the actual app, we expect a response or error.
  await expect(page.getByText('Resultaat')).toBeVisible();
});
