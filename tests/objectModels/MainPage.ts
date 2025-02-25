import { Locator, Page } from '@playwright/test';
import { baseUrl } from '../constants/baseUrl';

export class MainPage {
  public page: Page;
  public loginButton: Locator;
  public loginInput: Locator;
  public passwordInput: Locator;
  public menuList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = this.page.getByRole('button', { name: 'Sign in' });
    this.loginInput = this.page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    this.menuList = this.page.locator('ul[role="menu"]');
  }

  async goto() {
    await this.page.goto(`${baseUrl}`);
  }

  async login(username: string, password: string) {
    await this.loginInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
