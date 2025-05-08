import { test, expect } from '@playwright/test';
import { StatusesPage } from '../../objectModels';
import { initializePage } from '../../utils';

test.describe('Status Deletion', () => {
  let statusPage: StatusesPage;

  test.beforeEach(async ({ page }) => {
    statusPage = await initializePage<StatusesPage>({ page, type: 'statuses' });
  });

  test('should be deleted pair of statuses correctly', async () => {
    const { tableBody, deleteButton, page } = statusPage;
    const firstStatus = tableBody.locator('tr').nth(0);
    await firstStatus.click();
    await deleteButton.click();
    await page.getByRole('menuitem', { name: 'Task statuses' }).click();
    await expect(tableBody.getByRole('row', { name: 'Draft', exact: true })).not.toBeVisible();
    expect(await tableBody.locator('tr').count()).toBe(4);

    const nextStatus = tableBody.locator('tr').nth(0);

    await nextStatus.getByRole('checkbox').click();
    await expect(page.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();
    await deleteButton.click();
    await expect(tableBody.getByRole('row', { name: 'Draft', exact: true })).not.toBeVisible();
    expect(await tableBody.locator('tr').count()).toBe(3);
  });

  test('should delete multiple statuses', async () => {
    const { tableBody, tableHeader, deleteButton, page } = statusPage;
    const countOfStatusesBefore = await tableBody.locator('tr').count();

    await tableHeader.getByRole('checkbox').click();
    const allStatuses = tableBody.locator('tr');

    for (let i = 0; i < (await allStatuses.count()); i++) {
      await expect(allStatuses.nth(i).getByRole('checkbox')).toBeChecked();
    }

    await deleteButton.click();

    expect(await allStatuses.count()).toBe(0);
    await expect(page.getByText('No Task statuses yet.')).toBeVisible();
    await expect(page.getByText(`${countOfStatusesBefore} elements deleted`)).toBeVisible();
  });
});
