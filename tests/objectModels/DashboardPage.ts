import { Locator, Page } from '@playwright/test';
import { baseUrl } from '../constants/baseUrl';

export class DashboardPage {
  public page: Page;
  public menuItems: Locator;
  public themeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuItems = this.page.locator('ul[role="menu"] > a');
    this.themeButton = this.page.getByLabel('Toggle light/dark mode');
  }

  async goto() {
    await this.page.goto(`${baseUrl}/#/`);
  }
}
