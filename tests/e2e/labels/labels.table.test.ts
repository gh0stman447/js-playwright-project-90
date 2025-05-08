import { test, expect } from '@playwright/test';
import { LabelsPage } from '../../objectModels';
import { initializePage } from '../../utils';

test.describe('Labels Table', () => {
  let labelPage: LabelsPage;

  test.beforeEach(async ({ page }) => {
    labelPage = await initializePage<LabelsPage>({ page, type: 'labels' });
  });

  test.describe('Table Header', () => {
    test('should display correct columns', async () => {
      const { tableHeader } = labelPage;

      const headerItems = await tableHeader.locator('th').allTextContents();
      expect(headerItems).toEqual(['', 'Id', 'Name', 'Created at']);

      const checkbox = tableHeader.getByRole('checkbox');
      await expect(checkbox).toBeVisible();
      await expect(checkbox).not.toBeChecked();
    });
  });

  test.describe('Table Body', () => {
    test('should display labels with correct data', async () => {
      const { tableBody } = labelPage;
      const countOfItemsInTable = await tableBody.locator('tr').count();
      expect(countOfItemsInTable).toBe(5);

      for (let i = 1; i <= countOfItemsInTable; i++) {
        const currentRow = tableBody.locator(`tr:nth-child(${i})`);
        const checkbox = currentRow.locator('td').nth(0).getByRole('checkbox');
        const id = currentRow.locator('td').nth(1);
        const name = currentRow.locator('td').nth(2);
        const createdAt = currentRow.locator('td').nth(3);

        const contents = [checkbox, id, name, createdAt];

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
});
