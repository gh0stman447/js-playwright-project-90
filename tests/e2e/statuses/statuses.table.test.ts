import { test, expect } from '@playwright/test';
import { StatusesPage } from '../../objectModels';
import { initializePage } from '../../utils';

test.describe('Status Table', () => {
  let statusPage: StatusesPage;

  test.beforeEach(async ({ page }) => {
    statusPage = await initializePage<StatusesPage>({ page, type: 'statuses' });
  });

  test('should status list display correctly', async () => {
    const { tableHeader, tableBody, table } = statusPage;
    const headerItems = await tableHeader.locator('th').allTextContents();
    expect(headerItems).toEqual(['', 'Id', 'Name', 'Slug', 'Created at']);

    const countOfItemsInTable = await tableBody.locator('tr').count();
    expect(countOfItemsInTable).toBe(5);

    for (let i = 1; i <= countOfItemsInTable; i++) {
      const currentRow = tableBody.locator(`tr:nth-child(${i})`);

      const checkbox = currentRow.locator('td').nth(0).getByRole('checkbox');
      const id = currentRow.locator('td').nth(1);
      const name = currentRow.locator('td').nth(2);
      const slug = currentRow.locator('td').nth(3);
      const createdAt = currentRow.locator('td').nth(4);

      const contents = [checkbox, id, name, slug, createdAt];

      for (let j = 0; j < contents.length; j++) {
        if (j === 0) {
          await expect(checkbox).not.toBeChecked();
        }
        await expect(contents[j]).toBeVisible();
        await expect(contents[j]).not.toBeEmpty();
      }
    }
  });
});
