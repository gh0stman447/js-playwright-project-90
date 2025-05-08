import { test, expect } from '@playwright/test';
import { LabelsPage } from '../../objectModels';
import { initializePage } from '../../utils';

test.describe('Label Deletion', () => {
  let labelPage: LabelsPage;

  test.beforeEach(async ({ page }) => {
    labelPage = await initializePage<LabelsPage>({ page, type: 'labels' });
  });

  test.describe('Single Label Deletion', () => {
    test('should delete single label', async () => {
      const { tableBody, deleteButton, page } = labelPage;
      const firstLabel = tableBody.locator('tr').first();
      const countOfLabelsBefore = await tableBody.locator('tr').count();
      const nameOfFirstLabel = (await firstLabel.locator('td').nth(2).textContent()) ?? '';

      await firstLabel.click();
      await deleteButton.click();
      await page.getByRole('menuitem', { name: 'Labels' }).click();

      await expect(tableBody.getByRole('row', { name: nameOfFirstLabel })).not.toBeVisible();
      const countOfLabelsAfter = await tableBody.locator('tr').count();
      expect(countOfLabelsAfter).toBe(countOfLabelsBefore - 1);
    });
  });

  test.describe('Bulk Label Deletion', () => {
    test('should delete all labels', async () => {
      const { tableBody, tableHeader, deleteButton, page } = labelPage;
      const countOfLabelsBefore = await tableBody.locator('tr').count();

      await tableHeader.getByRole('checkbox').click();
      const allLabels = tableBody.locator('tr');

      for (let i = 0; i < (await allLabels.count()); i++) {
        await expect(allLabels.nth(i).getByRole('checkbox')).toBeChecked();
      }

      await deleteButton.click();

      expect(await allLabels.count()).toBe(0);
      await expect(page.getByText('No labels yet')).toBeVisible();
      await expect(page.getByText(`${countOfLabelsBefore} elements deleted`)).toBeVisible();
    });
  });
});
