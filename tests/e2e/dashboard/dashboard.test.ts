import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../objectModels';
import { login, switchTheme } from '../../utils';

const items = ['Dashboard', 'Tasks', 'Users', 'Labels', 'Task statuses'];

test.describe('test dashboard', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    await login(page);
    dashboardPage = new DashboardPage(page);
  });

  test.describe('test theme switch', () => {
    test('should theme switcher display', async ({ page }) => {
      await expect(page.getByLabel('Toggle light/dark mode')).toBeVisible();
    });

    // test('should theme switcher', async ({ page }) => {
    //   await switchTheme(page);
    //   await expect(page.locator('body')).toHaveScreenshot();
    // });
  });

  test('should have the same count of items in the menu', async () => {
    const menuItems = dashboardPage.menuItems;
    await expect(menuItems).toHaveCount(items.length);
  });

  test('should visible all items', async () => {
    const menuItems = dashboardPage.menuItems;
    for (let i = 0; i < items.length; i++) {
      await expect(menuItems.nth(i)).toBeVisible();
    }
  });

  test('should have a correct names of items', async () => {
    const menuItems = dashboardPage.menuItems;

    await expect(menuItems).toHaveText(items);
  });
});
