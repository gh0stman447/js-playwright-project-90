import { Locator, Page } from '@playwright/test';
import { baseUrl } from '../constants/baseUrl';

export class UsersPage {
  public page: Page;
  public createUserButton: Locator;
  public emailFormField: Locator;
  public firstNameFormField: Locator;
  public lastNameFormField: Locator;
  public saveUserButton: Locator;
  public showInfoButton: Locator;
  public table: Locator;
  public tableHeader: Locator;
  public tableBody: Locator;
  public countItemsSelector: Locator;
  public deleteUserButton: Locator;

  constructor(page: Page) {
    this.page = page;

    //Form fields
    this.emailFormField = this.page.getByRole('textbox', { name: 'Email' });
    this.firstNameFormField = this.page.getByRole('textbox', { name: 'First name' });
    this.lastNameFormField = this.page.getByRole('textbox', { name: 'Last name' });

    //Buttons
    this.saveUserButton = this.page.getByRole('button', { name: 'Save' });
    this.showInfoButton = this.page.getByRole('link', { name: 'Show' });
    this.createUserButton = this.page.getByRole('link', { name: 'Create' });
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

  async fillUserForm(email: string, firstName: string, lastName: string) {
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
