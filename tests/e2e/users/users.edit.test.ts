import { test, expect, Page } from '@playwright/test';
import { initializePage, login, wait } from '../../utils';
import { UsersPage } from '../../objectModels';
import { notCorrectUserData, otherUserData } from '../../constants/userData';

test.describe('User Editing', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    usersPage = await initializePage<UsersPage>({ page, type: 'users' });
  });

  test.describe('Edit form', () => {
    test('should edit userForm display correctly', async () => {
      const {
        tableBody,
        emailFormField,
        firstNameFormField,
        lastNameFormField,
        saveButton,
        deleteButton,
        showInfoButton,
      } = usersPage;

      await tableBody.locator('tr').first().click();

      const elements = [
        { locator: emailFormField, name: 'Email field' },
        { locator: firstNameFormField, name: 'First name field' },
        { locator: lastNameFormField, name: 'Last name field' },
        { locator: saveButton, name: 'Save button' },
        { locator: deleteButton, name: 'Delete button' },
        { locator: showInfoButton, name: 'Show info button' },
      ];

      for (const { locator, name } of elements) {
        await expect(locator, `${name} should be visible`).toBeVisible();
      }
    });

    test('should main userInfo display correctly', async ({ page }) => {
      const { tableBody, emailFormField, firstNameFormField, lastNameFormField } = usersPage;
      const rows = await tableBody.locator('tr').count();

      for (let i = 0; i < rows; i++) {
        const currentRow = tableBody.locator(`tr:nth-child(${i + 1})`);
        const email = await currentRow.locator('td:nth-child(3)').innerText();
        const firstName = await currentRow.locator('td:nth-child(4)').innerText();
        const lastName = await currentRow.locator('td:nth-child(5)').innerText();

        await currentRow.click();
        await expect(emailFormField).toHaveValue(email);
        await expect(firstNameFormField).toHaveValue(firstName);
        await expect(lastNameFormField).toHaveValue(lastName);
        await page.goBack();
      }
    });

    test('should modified user info', async ({ page }) => {
      const { tableBody, emailFormField, firstNameFormField, lastNameFormField, saveButton } =
        usersPage;

      await tableBody.locator('tr:nth-child(1)').click();
      await usersPage.clearUserForm();

      await emailFormField.fill(otherUserData.email);
      await firstNameFormField.fill(otherUserData.firstName);
      await lastNameFormField.fill(otherUserData.lastName);
      await saveButton.click();

      await wait(1000);
      await expect(page.getByText('Element updated')).toBeVisible();
      await tableBody.locator('tr:nth-child(1)').click();

      await expect(emailFormField).toHaveValue(otherUserData.email);
      await expect(firstNameFormField).toHaveValue(otherUserData.firstName);
      await expect(lastNameFormField).toHaveValue(otherUserData.lastName);
    });

    test('should report a change error', async ({ page }) => {
      const { tableBody, emailFormField, firstNameFormField, lastNameFormField, saveButton } =
        usersPage;
      const emptyErrorMsg = 'required';
      const wrongEmailMsg = 'Incorrect email format';

      await tableBody.locator('tr:nth-child(2)').click();
      await usersPage.clearUserForm();
      await saveButton.click();

      expect(await page.getByText(emptyErrorMsg).count()).toBe(3);
      await firstNameFormField.fill(otherUserData.firstName);

      expect(await page.getByText(emptyErrorMsg).count()).toBe(2);
      await lastNameFormField.fill(otherUserData.lastName);

      expect(await page.getByText(emptyErrorMsg).count()).toBe(1);
      await emailFormField.fill(notCorrectUserData.email);

      expect(await page.getByText(wrongEmailMsg).count()).toBe(1);
      await expect(page.getByText(emptyErrorMsg)).not.toBeVisible();
      await emailFormField.fill(otherUserData.email);
      await expect(page.getByText(wrongEmailMsg)).not.toBeVisible();
      await expect(page.getByText(emptyErrorMsg)).not.toBeVisible();
    });
  });
});
