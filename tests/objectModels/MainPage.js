import { baseUrl } from './constants/baseurl';

export class MainPage {
  constructor(page) {
    this.page = page;
    this.loginButton = this.page.getByRole('button', { name: 'Sign in' });
    this.loginInput = this.page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    this.menuList = this.page.locator('ul[role="menu"]');
  }

  async goto() {
    await this.page.goto(`${baseUrl}`);
  }

  async login(username, password) {
    await this.loginInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async fillByLabel({ page, fieldName, label }) {
    await page.getByRole('textbox', { name: fieldName }).fill(label);
  }
}
