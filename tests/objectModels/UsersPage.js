import { baseUrl } from '../constants/baseurl';

export class UsersPage {
  constructor(page) {
    //createUserForm
    this.page = page;
    this.createUserButton = this.page.getByRole('link', { name: 'Create' });
    this.emailFormField = this.page.getByRole('textbox', { name: 'Email' });
    this.firstNameFormField = this.page.getByRole('textbox', { name: 'First name' });
    this.lastNameFormField = this.page.getByRole('textbox', { name: 'Last name' });
    this.saveUserButton = this.page.getByRole('button', { name: 'Save' });
    this.showInfoButton = this.page.getByRole('link', { name: 'Show' });
    this.deleteUserButton = this.page.getByRole('button', { name: 'Delete' });

    //Table
    this.table = this.page.locator('table');
    this.tableHeader = this.page.locator('table thead');
    this.tableBody = this.page.locator('table tbody');
    this.countItemsSelector = this.page.getByRole('combobox', { name: 'Rows per page:' });
  }

  async goto() {
    await this.page.goto(`${baseUrl}/#/users`);
  }

  async fillByLabel({ page, fieldName, label }) {
    await page.getByRole('textbox', { name: fieldName }).fill(label);
  }

  async fillForm(email, firstName, lastName) {
    await this.emailFormField.fill(email);
    await this.firstNameFormField.fill(firstName);
    await this.lastNameFormField.fill(lastName);
  }

  async clearForm() {
    await this.emailFormField.clear();
    await this.firstNameFormField.clear();
    await this.lastNameFormField.clear();
  }
}
