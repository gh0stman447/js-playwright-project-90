import { test, expect } from '@playwright/test';
import { LabelsPage } from '../../objectModels';
import { initializePage } from '../../utils';
import { newLabelData } from '../../constants/labelData';

test.describe('Label Creation', () => {
  let labelPage: LabelsPage;

  test.beforeEach(async ({ page }) => {
    labelPage = await initializePage<LabelsPage>({ page, type: 'labels' });
  });

  test.describe('Create Form', () => {
    test('should display create button', async () => {
      await expect(labelPage.createButton).toBeVisible();
    });

    test('should display label form with required fields', async () => {
      const { nameFormField, saveButton, createButton } = labelPage;

      await createButton.click();
      await expect(nameFormField).toBeVisible();
      await expect(saveButton).toBeDisabled();
    });
  });

  test.describe('Create Label', () => {
    test('should create new label with valid data', async () => {
      const { createButton, saveButton, tableBody } = labelPage;
      const countOfLabelsBefore = await tableBody.locator('tr').count();

      await createButton.click();
      await labelPage.fillLabelForm(newLabelData.name);
      await saveButton.click();

      await labelPage.goto();
      const countOfLabelsAfter = await tableBody.locator('tr').count();
      expect(countOfLabelsAfter).toBe(countOfLabelsBefore + 1);

      const newLabel = tableBody.locator('tr').last();
      await expect(newLabel.getByText(newLabelData.name)).toBeVisible();
    });
  });
});
