import { test, expect, Page } from '@playwright/test';
import { StatusesPage } from '../objectModels';
import { login } from '../utils';
import { newStatusData } from '../constants/statusData';

test.describe('test statuses', () => {
  let statusesPage: StatusesPage;

  test.beforeEach(async ({ page }) => {
    await login(page);
    statusesPage = new StatusesPage(page);
    await statusesPage.goto();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test.describe('test create statusForm', async () => {
    test('should createStutusButton display', async () => {
      const { createStatusButton } = statusesPage;
      await expect(createStatusButton).toBeVisible();
    });

    test('should correct display form', async () => {
      const { nameFormField, slugFormField, saveStatusButton, createStatusButton } = statusesPage;

      await createStatusButton.click();
      for (const ui of [nameFormField, slugFormField, saveStatusButton]) {
        await expect(ui).toBeVisible();
      }
    });

    test('should create new status and check the data display correclty', async ({ page }) => {
      const { createStatusButton, saveStatusButton, fillStatusForm, tableBody } = statusesPage;

      await createStatusButton.click();
      await fillStatusForm.bind(statusesPage)(newStatusData.name, newStatusData.slug);
      await saveStatusButton.click();
      await expect(page.getByText('Element created')).toBeVisible();
      await page.getByRole('menuitem', { name: 'Task statuses' }).click();

      const createdStatus = tableBody.locator('tr').filter({ hasText: newStatusData.name });

      expect(createdStatus).toBeDefined();
      await expect(createdStatus.locator('td').nth(2)).toHaveText(newStatusData.name);
      await expect(createdStatus.locator('td').nth(3)).toHaveText(newStatusData.slug);
    });
  });

  test.describe('test status list', () => {
    test('should status list display correctly', async () => {
      const { tableHeader, tableBody, table } = statusesPage;
      const headerItems = await tableHeader.locator('th').allTextContents();
      expect(headerItems).toEqual(['', 'Id', 'Name', 'Slug', 'Created at']);

      await expect(table).toHaveScreenshot();

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

  test.describe('test edit statusForm', async () => {
    test('should edit statusForm display correctly', async ({ page }) => {
      const {
        tableBody,
        nameFormField,
        slugFormField,
        saveStatusButton,
        deleteStatusButton,
        showInfoButton,
      } = statusesPage;

      const firstStatus = tableBody.locator('tr').first();
      const nameOfFirstStatus = await firstStatus.locator('td').nth(2).textContent();
      const slugOfFirstStatus = await firstStatus.locator('td').nth(3).textContent();
      console.log(nameOfFirstStatus, slugOfFirstStatus);

      expect(await tableBody.locator('tr').first().click());
      const uis = [
        nameFormField,
        slugFormField,
        saveStatusButton,
        deleteStatusButton,
        showInfoButton,
      ];

      for (const ui of uis) {
        await expect(ui).toBeVisible();
      }

      expect(await nameFormField.inputValue()).toBe(nameOfFirstStatus);
      expect(await slugFormField.inputValue()).toBe(slugOfFirstStatus);
    });

    test('should be edited status correctly', async () => {
      const { tableBody, saveStatusButton, page } = statusesPage;
      const firstStatus = tableBody.locator('tr').first();

      const nameOfFirstStatus = firstStatus.locator('td').nth(2);
      const slugOfFirstStatus = firstStatus.locator('td').nth(3);

      await firstStatus.click();

      await statusesPage.fillStatusForm(newStatusData.name, newStatusData.slug);
      await saveStatusButton.click();

      await page.getByRole('menuitem', { name: 'Task statuses' }).click();

      await expect(nameOfFirstStatus).toHaveText(newStatusData.name);
      await expect(slugOfFirstStatus).toHaveText(newStatusData.slug);
    });
  });

  test.describe('test delete status', async () => {
    test('should be deleted pare of statuses correctly', async () => {
      const { tableBody, deleteStatusButton, page } = statusesPage;
      const firstStatus = tableBody.locator('tr').nth(0);
      await firstStatus.click();
      await deleteStatusButton.click();
      await page.getByRole('menuitem', { name: 'Task statuses' }).click();
      await expect(tableBody.getByRole('row', { name: 'Draft', exact: true })).not.toBeVisible();
      expect(await tableBody.locator('tr').count()).toBe(4);

      const nextStatus = tableBody.locator('tr').nth(0);

      await nextStatus.getByRole('checkbox').click();
      await expect(page.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();
      await deleteStatusButton.click();
      await expect(tableBody.getByRole('row', { name: 'Draft', exact: true })).not.toBeVisible();
      expect(await tableBody.locator('tr').count()).toBe(3);
    });

    test('should be deleted all statuses', async () => {
      const { tableBody, tableHeader, deleteStatusButton, page } = statusesPage;

      const countOfStatusesBefore = await tableBody.locator('tr').count();
      await tableHeader.getByRole('checkbox').click();
      const allStatuses = tableBody.locator('tr');

      for (let i = 0; i < (await allStatuses.count()); i++) {
        await expect(allStatuses.nth(i).getByRole('checkbox')).toBeChecked();
      }

      await deleteStatusButton.click();
      expect(await allStatuses.count()).toBe(0);
      await expect(page.getByText('No Task statuses yet.')).toBeVisible();
      await expect(page.getByText(`${countOfStatusesBefore} elements deleted`)).toBeVisible();
    });
  });
});
