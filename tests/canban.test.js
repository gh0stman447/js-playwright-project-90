import { test, expect } from '@playwright/test';

class CanbanPage {
  constructor(page) {
    this.page = page;
    this.loginButton = this.page.getByRole('button', { name: 'Sign in' });
    this.loginInput = this.page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    this.menuList = this.page.locator('ul[role="menu"]');
  }

  async goto() {
    await this.page.goto('http://localhost:5173');
  }

  async login(username, password) {
    await this.loginInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

test.describe('test canban', () => {
  let canbanPage;
  test.beforeEach(async ({ page }) => {
    canbanPage = new CanbanPage(page);
    await canbanPage.goto();
  });

  test('should render a start page', async () => {
    await canbanPage.goto();
    await expect(canbanPage.loginButton).toBeVisible();
  });

  test('should login and render main page', async ({ page }) => {
    await canbanPage.goto();
    await canbanPage.login('admin', 'admin');
    await expect(page.getByText('Welcome to the administration')).toBeVisible();

    for (let i = 0; i < (await canbanPage.menuList.count()); i++) {
      await expect(canbanPage.menuList.nth(i)).toBeVisible();
    }
  });
});
