import { test, expect } from '@playwright/test';

test('should render a start page', async ({ page }) => {
  page.goto('http://localhost:5173');

  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});
