import { Locator, Page } from '@playwright/test';
import { baseUrl } from '../constants/baseUrl';
import { IPage } from './IPage';

export abstract class BasePage implements IPage {
  public page: Page;
  public createButton: Locator;
  public saveButton: Locator;
  public deleteButton: Locator;
  public showInfoButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = this.page.getByRole('link', { name: 'Create' });
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.deleteButton = this.page.getByRole('button', { name: 'Delete' });
    this.showInfoButton = this.page.getByRole('link', { name: 'Show' });
  }

  protected abstract getUrl(): string;

  async goto() {
    await this.page.goto(`${baseUrl}${this.getUrl()}`);
  }

  async clearForm(fields: Locator[]) {
    for (const field of fields) {
      await field.clear();
    }
  }
}
