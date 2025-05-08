import { test, expect } from '@playwright/test';
import { LabelsPage } from '../../objectModels';
import { initializePage } from '../../utils';
import { newLabelData } from '../../constants/labelData';

test.describe('Label Editing', () => {
  let labelPage: LabelsPage;

  test.beforeEach(async ({ page }) => {
    labelPage = await initializePage<LabelsPage>({ page, type: 'labels' });
  });

  test.describe('Edit Form', () => {
    test('should display edit form with label data', async () => {
      const { tableBody, nameFormField, saveButton, deleteButton, showInfoButton } = labelPage;

      const firstLabel = tableBody.locator('tr').first();
      const nameOfFirstLabel = await firstLabel.locator('td').nth(2).textContent();

      await firstLabel.click();
      const formElements = [nameFormField, saveButton, deleteButton, showInfoButton];

      for (const element of formElements) {
        await expect(element).toBeVisible();
      }

      expect(await nameFormField.inputValue()).toBe(nameOfFirstLabel);
    });
  });

  test.describe('Edit Label', () => {
    test('should update label data correctly', async () => {
      const { saveButton, tableBody } = labelPage;

      const firstLabel = tableBody.locator('tr').first();
      await firstLabel.click();
      await expect(saveButton).toBeDisabled();
      await labelPage.fillLabelForm(newLabelData.name);
      await expect(saveButton).toBeEnabled();
      await saveButton.click();
      expect(await firstLabel.locator('td').nth(2).innerText()).toBe(newLabelData.name);
    });
  });
});
