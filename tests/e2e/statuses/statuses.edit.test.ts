import { test, expect } from '@playwright/test';
import { StatusesPage } from '../../objectModels';
import { initializePage } from '../../utils';
import { newStatusData } from '../../constants/statusData';

test.describe('Status Editing', () => {
  let statusPage: StatusesPage;

  test.beforeEach(async ({ page }) => {
    statusPage = await initializePage<StatusesPage>({ page, type: 'statuses' });
  });

  test('should StatusForm display', async () => {
    const { tableBody, nameFormField, slugFormField, saveButton, deleteButton, showInfoButton } =
      statusPage;

    const firstStatus = tableBody.locator('tr').first();
    const name = await firstStatus.locator('td').nth(2).textContent();
    const slug = await firstStatus.locator('td').nth(3).textContent();

    expect(await tableBody.locator('tr').first().click());

    const formElements = [nameFormField, slugFormField, saveButton, deleteButton, showInfoButton];

    for (const element of formElements) {
      await expect(element).toBeVisible();
    }

    await expect(nameFormField).toHaveValue(name ?? '');
    await expect(slugFormField).toHaveValue(slug ?? '');
  });

  test('should edit status and check the data display correctly', async () => {
    const { tableBody, saveButton, page } = statusPage;
    const firstStatus = tableBody.locator('tr').first();

    const nameOfFirstStatus = firstStatus.locator('td').nth(2);
    const slugOfFirstStatus = firstStatus.locator('td').nth(3);

    await firstStatus.click();

    await statusPage.fillStatusForm(newStatusData.name, newStatusData.slug);
    await saveButton.click();

    await page.getByRole('menuitem', { name: 'Task statuses' }).click();

    await expect(nameOfFirstStatus).toHaveText(newStatusData.name);
    await expect(slugOfFirstStatus).toHaveText(newStatusData.slug);
  });
});
