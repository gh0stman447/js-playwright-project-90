import { Locator, Page } from '@playwright/test';
import { TablePage } from './TablePage';

export class LabelsPage extends TablePage {
  public nameFormField: Locator;

  constructor(page: Page) {
    super(page);
    this.nameFormField = this.page.getByRole('textbox', { name: 'Name' });
  }

  protected getUrl(): string {
    return '/#/labels';
  }

  async fillLabelForm(name: string) {
    await this.nameFormField.fill(name);
  }

  async clearLabelForm() {
    await this.clearForm([this.nameFormField]);
  }
}
