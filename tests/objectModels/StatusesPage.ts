import { Locator, Page } from '@playwright/test';
import { baseUrl } from '../constants/baseUrl';

export class StatusesPage {
  public page: Page;
  public createStatusButton: Locator;
  public nameFormField: Locator;
  public slugFormField: Locator;
  public saveStatusButton: Locator;
  public showInfoButton: Locator;
  public table: Locator;
  public tableHeader: Locator;
  public tableBody: Locator;
  public countItemsSelector: Locator;
  public deleteStatusButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createStatusButton = this.page.getByRole('link', { name: 'Create' });
    this.nameFormField = this.page.getByRole('textbox', { name: 'Name' });
    this.slugFormField = this.page.getByRole('textbox', { name: 'Slug' });
    this.saveStatusButton = this.page.getByRole('button', { name: 'Save' });
    this.showInfoButton = this.page.getByRole('link', { name: 'Show' });
    this.deleteStatusButton = this.page.getByRole('button', { name: 'Delete' });

    //Table
    this.table = this.page.locator('table');
    this.tableHeader = this.page.locator('table thead');
    this.tableBody = this.page.locator('table tbody');
    this.countItemsSelector = this.page.getByRole('combobox', { name: 'Rows per page:' });
  }

  async goto() {
    await this.page.goto(`${baseUrl}/#/task_statuses`);
  }

  async fillByLabel({ page, fieldName, label }: { page: Page; fieldName: string; label: string }) {
    await page.getByRole('textbox', { name: fieldName }).fill(label);
  }

  async fillStatusForm(name: string, slug: string) {
    await this.nameFormField.fill(name);
    await this.slugFormField.fill(slug);
  }

  async clearStatusForm() {
    await this.nameFormField.clear();
    await this.slugFormField.clear();
  }
}
