const baseUrl = 'http://localhost:5173/';

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

export class UsersPage {
  constructor(page) {
    this.page = page;
    this.createUserButton = this.page.getByRole('link', { name: 'Create' });
    this.emailFormField = this.page.getByRole('textbox', { name: 'Email' });
    this.firstNameFormField = this.page.getByRole('textbox', { name: 'First name' });
    this.lastNameFormField = this.page.getByRole('textbox', { name: 'Last name' });
    this.saveUserButton = this.page.getByRole('button', { name: 'Save' });
  }

  async goto() {
    await this.page.goto(`${baseUrl}/#/users`);
  }

  async fillByLabel({ page, fieldName, label }) {
    await page.getByRole('textbox', { name: fieldName }).fill(label);
  }
}
