import { Locator, Page } from '@playwright/test';
import { TablePage } from './TablePage';

export class UsersPage extends TablePage {
  public emailFormField: Locator;
  public firstNameFormField: Locator;
  public lastNameFormField: Locator;

  constructor(page: Page) {
    super(page);
    this.emailFormField = this.page.getByRole('textbox', { name: 'Email' });
    this.firstNameFormField = this.page.getByRole('textbox', { name: 'First name' });
    this.lastNameFormField = this.page.getByRole('textbox', { name: 'Last name' });
  }

  protected getUrl(): string {
    return '/#/users';
  }

  async fillUserForm(email: string, firstName: string, lastName: string) {
    await this.emailFormField.fill(email);
    await this.firstNameFormField.fill(firstName);
    await this.lastNameFormField.fill(lastName);
  }

  async clearUserForm() {
    await this.clearForm([this.emailFormField, this.firstNameFormField, this.lastNameFormField]);
  }
}
