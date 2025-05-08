import { test, expect } from '@playwright/test';
import { initializePage, login } from '../../utils';
import { UsersPage } from '../../objectModels';

test.describe('Users Table', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    usersPage = await initializePage<UsersPage>({ page, type: 'users' });
  });

  test.describe('test userTable', () => {
    test('should userTable display', async () => {
      const { table, tableHeader, tableBody } = usersPage;

      await expect(table).toBeVisible();
      const headerItems = await tableHeader.locator('th').allTextContents();
      expect(headerItems).toEqual(['', 'Id', 'Email', 'First name', 'Last name', 'Created at']);
      expect(await tableBody.locator('tr').count()).toBe(8);
    });

    test('should userTable display 5 rows', async ({ page }) => {
      const { tableBody, countItemsSelector } = usersPage;
      await countItemsSelector.click();
      await page.getByRole('option', { name: '5', exact: true }).click();
      expect(await tableBody.locator('tr').count()).toBe(5);
    });

    test('should userTable display left/right arrows', async ({ page }) => {
      const { countItemsSelector } = usersPage;

      await countItemsSelector.click();
      await page.getByRole('option', { name: '5', exact: true }).click();

      const leftArrow = page.getByLabel('Go to previous page');
      const rightArrow = page.getByLabel('Go to next page');

      await expect(leftArrow).toBeVisible();
      await expect(leftArrow).toBeDisabled();
      await expect(rightArrow).toBeVisible();
      await expect(rightArrow).not.toBeDisabled();
    });

    test('should info about users in table display', async () => {
      const { tableBody, page } = usersPage;
      const rows = await tableBody.locator('tr').count();

      for (let i = 1; i <= rows; i++) {
        const currentRow = tableBody.locator(`tr:nth-child(${i})`);
        expect(currentRow.locator('td:nth-child(3)')).not.toBe('');
        expect(currentRow.locator('td:nth-child(4)')).not.toBe('');
        expect(currentRow.locator('td:nth-child(5)')).not.toBe('');
      }
    });
  });
});
