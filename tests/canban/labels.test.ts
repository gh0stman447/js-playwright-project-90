import { test, expect } from '@playwright/test';
import { LabelsPage } from '../objectModels';
import { login } from '../utils';
import { newLabelData } from '../constants/labelData';

test.describe('test labels', () => {
  let labelsPage: LabelsPage;

  test.beforeEach(async ({ page }) => {
    await login(page);
    labelsPage = new LabelsPage(page);
    await labelsPage.goto();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test.describe('test create statusLabel', () => {
    test('should createStutusButton display', async () => {
      const { createLabelButton } = labelsPage;
      await expect(createLabelButton).toBeVisible();
    });

    test('should statusLabelForm display correctly', async () => {
      const { saveLabelButton, nameFormField, tableBody, createLabelButton } = labelsPage;

      await createLabelButton.click();
      await expect(saveLabelButton).toBeVisible();
      await expect(nameFormField).toBeVisible();
    });

    test('should create new statusLabel and check the data display correclty', async () => {
      const { tableBody, createLabelButton, saveLabelButton, page } = labelsPage;
      const countOfLabelsBefore = await tableBody.locator('tr').count();
      await createLabelButton.click();
      await labelsPage.fillLabelForm(newLabelData.name);
      await saveLabelButton.click();
      await page.getByRole('menuitem', { name: 'Labels' }).click();
      const countOfLabelsAfter = await tableBody.locator('tr').count();

      expect(countOfLabelsAfter).toBe(countOfLabelsBefore + 1);

      const newLabel = tableBody.getByRole('row', { name: newLabelData.name });

      await expect(newLabel).toBeVisible();
      expect(await newLabel.locator('td').nth(2).innerText()).toBe(newLabelData.name);
    });
  });

  test.describe('test label list', async () => {
    test('should table header display correctly', async () => {
      const { tableHeader } = labelsPage;

      const headerItems = await tableHeader.locator('th').allTextContents();
      expect(headerItems).toEqual(['', 'Id', 'Name', 'Created at']);

      const checkbox = tableHeader.getByRole('checkbox');

      await expect(checkbox).toBeVisible();
      await expect(checkbox).not.toBeChecked();
    });

    test('should list body display correctly', async () => {
      const { tableBody } = labelsPage;

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

    // test('should label list display correctly', async () => {
    //   const { table } = labelsPage;
    //   await expect(table).toHaveScreenshot();
    // });
  });

  test.describe('test edit labelForm', async () => {
    test('should edit labelForm display correctly', async ({ page }) => {
      const { tableBody, nameFormField, saveLabelButton, deleteLabelButton, showInfoButton } =
        labelsPage;

      const firstLabel = tableBody.locator('tr').first();
      const nameOfFirtLabel = await firstLabel.locator('td').nth(2).textContent();

      await firstLabel.click();
      const uis = [nameFormField, saveLabelButton, deleteLabelButton, showInfoButton];

      for (const ui of uis) {
        await expect(ui).toBeVisible();
      }

      expect(await nameFormField.inputValue()).toBe(nameOfFirtLabel);
    });

    test('should edit labelForm and check the data display correclty', async () => {
      const { saveLabelButton, tableBody } = labelsPage;

      const firstLabel = tableBody.locator('tr').first();
      await firstLabel.click();
      await expect(saveLabelButton).toBeDisabled();
      await labelsPage.fillLabelForm(newLabelData.name);
      await expect(saveLabelButton).toBeEnabled();
      await saveLabelButton.click();
      expect(await firstLabel.locator('td').nth(2).innerText()).toBe(newLabelData.name);
    });
  });

  test.describe('test delete label', async () => {
    test('should be deleted pare of labels correctly', async () => {
      const { tableBody, deleteLabelButton, page } = labelsPage;
      const firstLabel = tableBody.locator('tr').first();
      const countOfLabelsBefore = await tableBody.locator('tr').count();
      const nameOfFirstLabel = (await firstLabel.locator('td').nth(2).textContent()) ?? '';
      await firstLabel.click();
      await deleteLabelButton.click();
      await page.getByRole('menuitem', { name: 'Labels' }).click();
      await expect(tableBody.getByRole('row', { name: nameOfFirstLabel })).not.toBeVisible();

      const countOfLabelsAfter = await tableBody.locator('tr').count();
      expect(countOfLabelsAfter).toBe(countOfLabelsBefore - 1);
    });

    test('should be deleted all labels', async () => {
      const { tableBody, tableHeader, deleteLabelButton, page } = labelsPage;

      const countOfLabelsBefore = await tableBody.locator('tr').count();
      await tableHeader.getByRole('checkbox').click();
      const allLabels = tableBody.locator('tr');

      for (let i = 0; i < (await allLabels.count()); i++) {
        await expect(allLabels.nth(i).getByRole('checkbox')).toBeChecked();
      }

      await deleteLabelButton.click();

      expect(await allLabels.count()).toBe(0);
      await expect(page.getByText('No labels yet')).toBeVisible();
      await expect(page.getByText(`${countOfLabelsBefore} elements deleted`)).toBeVisible();
    });
  });
});
