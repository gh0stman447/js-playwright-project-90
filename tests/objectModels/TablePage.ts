import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export abstract class TablePage extends BasePage {
  public table: Locator;
  public tableHeader: Locator;
  public tableBody: Locator;
  public countItemsSelector: Locator;
  public globalCheckbox: Locator;
  public rowCheckboxes: Locator;

  constructor(page: Page) {
    super(page);
    this.table = this.page.locator('table');
    this.tableHeader = this.page.locator('table thead');
    this.tableBody = this.page.locator('table tbody');
    this.countItemsSelector = this.page.getByRole('combobox', { name: 'Rows per page:' });
    this.globalCheckbox = this.tableHeader
      .locator('th')
      .getByRole('checkbox', { name: 'Select all' });
    this.rowCheckboxes = this.tableBody.locator('tr').getByRole('checkbox');
  }

  public async selectAllRows() {
    await this.globalCheckbox.check();
  }

  public async selectRow(rowNumber: number) {
    await this.rowCheckboxes.nth(rowNumber).check();
  }

  public async clickOnDeleteButton() {
    this.deleteButton.click();
  }
}
