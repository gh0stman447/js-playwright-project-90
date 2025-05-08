import { test, expect } from '@playwright/test';
import { initializePage, login } from '../../utils';
import { UsersPage } from '../../objectModels';

test.describe('User Deletion', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    usersPage = await initializePage<UsersPage>({ page, type: 'users' });
  });

  test.describe('test delete user', () => {
    test('should delete user by delete button', async ({ page }) => {
      const { tableBody, deleteButton } = usersPage;

      await tableBody.locator('tr').first().click();
      await deleteButton.click();

      await expect(page.getByText('john@google.com', { exact: true })).not.toBeVisible();
      await expect(tableBody.locator('tr')).toHaveCount(7);
    });

    test('should delete user by checkbox', async ({ page }) => {
      const { tableBody, deleteButton, rowCheckboxes } = usersPage;

      // await tableBody.locator('tr').nth(0).getByRole('checkbox').check();
      await rowCheckboxes.first().check();
      // await deleteButton.click();
      usersPage.clickOnDeleteButton();

      await expect(tableBody.locator('tr')).toHaveCount(7);
      await expect(page.getByText('john@google.com', { exact: true })).not.toBeVisible();
    });

    test('should highlight all users after clicking on the delete button', async () => {
      const { tableBody, tableHeader } = usersPage;

      await tableHeader.locator('th').getByRole('checkbox', { name: 'Select all' }).check();
      const rows = await tableBody.locator('row').count();

      for (let i = 0; i < rows; i++) {
        await expect(tableBody.locator('tr').nth(i).getByRole('checkbox')).not.toBeChecked();
      }
    });

    test('should delete all users after clicking on the deleteAllUsers button', async ({
      page,
    }) => {
      const { tableHeader, deleteButton, tableBody, countItemsSelector } = usersPage;

      await tableHeader.locator('th').getByRole('checkbox', { name: 'Select all' }).check();
      await countItemsSelector.click();
      await page.getByRole('option', { name: '50' }).click();
      await deleteButton.click();

      expect(await tableBody.locator('tr').count()).toBe(0);
      await expect(page.getByText('No Users yet.')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Create' })).toBeVisible();
    });
  });
});
