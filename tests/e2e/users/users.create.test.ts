import { test, expect } from '@playwright/test';
import { initializePage, login } from '../../utils';
import { UsersPage } from '../../objectModels';
import { newUserData } from '../../constants/userData';

test.describe('User Creation', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    usersPage = await initializePage<UsersPage>({ page, type: 'users' });
  });

  test.describe('Create user form', () => {
    test('should do the screenshot of the page with masked zone', async ({ page }) => {
      const { tableBody } = usersPage;
      await page.locator('body').screenshot({
        path: 'screenshot.png',
        mask: [tableBody.locator('td:nth-child(6)')],
      });
    });

    test('should createUserButton display', async () => {
      await expect(usersPage.createButton).toBeVisible();
    });

    test('should createUserForm display', async () => {
      const { firstNameFormField, lastNameFormField, emailFormField, createButton } = usersPage;

      await createButton.click();
      await expect(firstNameFormField).toBeVisible();
      await expect(lastNameFormField).toBeVisible();
      await expect(emailFormField).toBeVisible();
    });

    test('should createUserForm save user', async ({ page }) => {
      const { createButton, saveButton, showInfoButton } = usersPage;

      await createButton.click();
      await usersPage.fillUserForm(newUserData.email, newUserData.firstName, newUserData.lastName);
      await saveButton.click();
      await showInfoButton.click();

      await expect(page.getByText(newUserData.email, { exact: true })).toBeVisible();
      await expect(page.getByText(newUserData.firstName, { exact: true })).toBeVisible();
      await expect(page.getByText(newUserData.lastName, { exact: true })).toBeVisible();

      await usersPage.goto();
      await expect(page.getByText('User@bk.ru')).toBeVisible();
    });
  });
});
