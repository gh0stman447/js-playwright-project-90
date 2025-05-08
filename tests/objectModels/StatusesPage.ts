import { Locator, Page } from '@playwright/test';
import { TablePage } from './TablePage';

export class StatusesPage extends TablePage {
  public nameFormField: Locator;
  public slugFormField: Locator;

  constructor(page: Page) {
    super(page);
    this.nameFormField = this.page.getByRole('textbox', { name: 'Name' });
    this.slugFormField = this.page.getByRole('textbox', { name: 'Slug' });
  }

  protected getUrl(): string {
    return '/#/task_statuses';
  }

  async fillStatusForm(name: string, slug: string) {
    await this.nameFormField.fill(name);
    await this.slugFormField.fill(slug);
  }

  async clearStatusForm() {
    await this.clearForm([this.nameFormField, this.slugFormField]);
  }
}
