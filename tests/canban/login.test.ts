import { test, expect } from '@playwright/test';
import { LoginPage } from '../objectModels';
import { authUserData } from '../constants/userData';
import { addTestBehavior, login, switchTheme } from '../utils';
import { describe } from 'node:test';

test.describe('test login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should render a start page', async ({ page }, testInfo) => {
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page.locator('.RaLogin-card')).toHaveScreenshot();
  });

  test('should login and render main page', async ({ page }) => {
    await login(page);

    await expect(page.getByText('Welcome to the administration')).toBeVisible();
  });
});
