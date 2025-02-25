import { Locator, Page } from '@playwright/test';
import { baseUrl } from '../constants/baseUrl';

export class LabelsPage {
  public page: Page;
  public createLabelButton: Locator;
  public nameFormField: Locator;
  public saveLabelButton: Locator;
  public deleteLabelButton: Locator;
  public showInfoButton: Locator;
  public table: Locator;
  public tableHeader: Locator;
  public tableBody: Locator;
  public countItemsSelector: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createLabelButton = this.page.getByRole('link', { name: 'Create' });
    this.nameFormField = this.page.getByRole('textbox', { name: 'Name' });
    this.saveLabelButton = this.page.getByRole('button', { name: 'Save' });
    this.deleteLabelButton = this.page.getByRole('button', { name: 'Delete' });
    this.showInfoButton = this.page.getByRole('link', { name: 'Show' });

    //Table
    this.table = this.page.locator('table');
    this.tableHeader = this.page.locator('table thead');
    this.tableBody = this.page.locator('table tbody');
    this.countItemsSelector = this.page.getByRole('combobox', { name: 'Rows per page:' });
  }

  async goto() {
    await this.page.goto(`${baseUrl}/#/labels`);
  }

  async fillLabelForm(name: string) {
    await this.nameFormField.fill(name);
  }

  async clearLabelForm() {
    await this.nameFormField.clear();
  }
}
