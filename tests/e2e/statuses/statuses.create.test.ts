import { test, expect } from '@playwright/test';
import { StatusesPage } from '../../objectModels';
import { initializePage } from '../../utils';
import { newStatusData } from '../../constants/statusData';

test.describe('Status Creation', () => {
  let statusPage: StatusesPage;

  test.beforeEach(async ({ page }) => {
    statusPage = await initializePage<StatusesPage>({ page, type: 'statuses' });
  });

  test('should createButton display', async () => {
    await expect(statusPage.createButton).toBeVisible();
  });

  test('should correct display form', async () => {
    const { nameFormField, slugFormField, saveButton, createButton } = statusPage;

    await createButton.click();

    const formFields = [nameFormField, slugFormField];

    for (const field of formFields) {
      await expect(field).toBeVisible();
    }

    await expect(saveButton).toBeDisabled();
  });

  test('should create new status correctly', async ({ page }) => {
    const { createButton, saveButton, fillStatusForm, tableBody } = statusPage;

    await createButton.click();
    await fillStatusForm.bind(statusPage)(newStatusData.name, newStatusData.slug);
    await saveButton.click();
    await expect(page.getByText('Element created')).toBeVisible();
    await page.getByRole('menuitem', { name: 'Task statuses' }).click();

    const createdStatus = tableBody.locator('tr').filter({ hasText: newStatusData.name });

    expect(createdStatus).toBeDefined();
    await expect(createdStatus.locator('td').nth(2)).toHaveText(newStatusData.name);
    await expect(createdStatus.locator('td').nth(3)).toHaveText(newStatusData.slug);
  });
});
