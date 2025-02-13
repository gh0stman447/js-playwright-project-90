import { test, expect } from '@playwright/test';
import { MainPage, UsersPage } from './objectModels';
import { authUserData, newUserData } from './testConstants';

test.describe('test login', () => {
  let mainPage;
  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('should render a start page', async () => {
    await expect(mainPage.loginButton).toBeVisible();
  });

  test('should login and render main page', async ({ page }) => {
    await mainPage.login(authUserData.username, authUserData.password);
    await expect(page.getByText('Welcome to the administration')).toBeVisible();

    for (let i = 0; i < (await mainPage.menuList.count()); i++) {
      await expect(mainPage.menuList.nth(i)).toBeVisible();
    }
  });
});

test.describe('test createUserForm', () => {
  let usersPage;
  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.login(authUserData.username, authUserData.password);
    usersPage = new UsersPage(page);
    await usersPage.goto();
  });

  test('should createUserForm display', async () => {
    const { firstNameFormField, lastNameFormField, emailFormField, createUserButton } = usersPage;

    await createUserButton.click();
    await expect(firstNameFormField).toBeVisible();
    await expect(lastNameFormField).toBeVisible();
    await expect(emailFormField).toBeVisible();
  });

  test('should createUserForm save user', async ({ page }) => {
    const { createUserButton, saveUserButton, showInfoButton, fillForm } = usersPage;

    await createUserButton.click();
    await fillForm(newUserData.email, newUserData.firstName, newUserData.lastName);
    await saveUserButton.click();
    await showInfoButton.click();

    await expect(page.getByText(newUserData.email, { exact: true })).toBeVisible();
    await expect(page.getByText(newUserData.firstName, { exact: true })).toBeVisible();
    await expect(page.getByText(newUserData.lastName, { exact: true })).toBeVisible();

    await await usersPage.goto();
    await expect(page.getByText('User@bk.ru')).toBeVisible();
  });
});

test.describe('test userTable', async () => {
  let usersPage;

  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.login(authUserData.username, authUserData.password);
    usersPage = new UsersPage(page);
    await usersPage.goto();
  });

  test('should userTable display', async ({ page }) => {
    const { table, tableHeader, tableBody, countItemsSelector } = usersPage;

    await expect(table).toBeVisible();
    const headerItems = await tableHeader
      .locator('th')
      .evaluateAll((ths) => ths.map((th) => th.innerText.trim()));

    expect(await headerItems).toEqual(['', 'Id', 'Email', 'First name', 'Last name', 'Created at']);
    expect(await tableBody.locator('tr').count()).toBe(8);
    await countItemsSelector.click();
    await page.getByRole('option', { name: 5 }).click();
    expect(await tableBody.locator('tr').count()).toBe(5);

    console.log(table, tableHeader, tableBody);
  });

  test('should main userInfo display', async ({ page }) => {
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
});
