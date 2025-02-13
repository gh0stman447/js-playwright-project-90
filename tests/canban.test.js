import { test, expect } from '@playwright/test';
import { MainPage, UsersPage } from './objectModels';
import { authUserData, newUserData, notCorrectUserData, otherUserData } from './testConstants';

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
    const { createUserButton, saveUserButton, showInfoButton } = usersPage;

    await createUserButton.click();

    await usersPage.fillForm(newUserData.email, newUserData.firstName, newUserData.lastName);

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

  test('should info about users in table display', async () => {
    const { tableBody } = usersPage;

    const rows = await tableBody.locator('tr').count();

    for (let i = 1; i <= rows; i++) {
      const currentRow = tableBody.locator(`tr:nth-child(${i})`);

      expect(await currentRow.locator('td:nth-child(3)')).not.toBe('');
      expect(await currentRow.locator('td:nth-child(4)')).not.toBe('');
      expect(await currentRow.locator('td:nth-child(5)')).not.toBe('');
    }
  });
});

test.describe('test edit userForm', async () => {
  let usersPage;

  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.login(authUserData.username, authUserData.password);
    usersPage = new UsersPage(page);
    await usersPage.goto();
  });

  test('should editForm and main userInfo display', async ({ page }) => {
    const {
      tableBody,
      emailFormField,
      firstNameFormField,
      lastNameFormField,
      saveUserButton,
      deleteUserButton,
    } = usersPage;
    const rows = await tableBody.locator('tr').count();

    for (let i = 0; i < rows; i++) {
      const currentRow = tableBody.locator(`tr:nth-child(${i + 1})`);
      const email = await currentRow.locator('td:nth-child(3)').innerText();
      const firstName = await currentRow.locator('td:nth-child(4)').innerText();
      const lastName = await currentRow.locator('td:nth-child(5)').innerText();

      await currentRow.click();

      await expect(emailFormField).toBeVisible();
      await expect(firstNameFormField).toBeVisible();
      await expect(lastNameFormField).toBeVisible();
      await expect(saveUserButton).toBeVisible();
      await expect(deleteUserButton).toBeVisible();

      await expect(emailFormField).toHaveValue(email);
      await expect(firstNameFormField).toHaveValue(firstName);
      await expect(lastNameFormField).toHaveValue(lastName);

      await page.goBack();
    }
  });

  test('should modify user info', async ({ page }) => {
    const { tableBody, emailFormField, firstNameFormField, lastNameFormField } = usersPage;
    await tableBody.locator('tr:nth-child(1)').click();

    await usersPage.clearForm();

    await emailFormField.fill(otherUserData.email);
    await firstNameFormField.fill(otherUserData.firstName);
    await lastNameFormField.fill(otherUserData.lastName);

    await usersPage.saveUserButton.click();

    await expect(page.getByText('Element updatedUndo')).toBeVisible();
    await tableBody.locator('tr:nth-child(1)').click();

    await expect(emailFormField).toHaveValue(otherUserData.email);
    await expect(firstNameFormField).toHaveValue(otherUserData.firstName);
    await expect(lastNameFormField).toHaveValue(otherUserData.lastName);
  });

  test('should report a change error', async ({ page }) => {
    const { tableBody, emailFormField, firstNameFormField, lastNameFormField, saveUserButton } =
      usersPage;
    const emptyErrorMsg = 'required';
    const wrongEmailMsg = 'Incorrect email format';

    await tableBody.locator('tr:nth-child(2)').click();
    await usersPage.clearForm();
    await saveUserButton.click();

    expect(await page.getByText(emptyErrorMsg).count()).toBe(3);
    await firstNameFormField.fill(otherUserData.firstName);
    expect(await page.getByText(emptyErrorMsg).count()).toBe(2);
    await lastNameFormField.fill(otherUserData.lastName);
    expect(await page.getByText(emptyErrorMsg).count()).toBe(1);
    await emailFormField.fill(notCorrectUserData.email);
    expect(await page.getByText(wrongEmailMsg).count()).toBe(1);
    expect(await page.getByText(emptyErrorMsg)).not.toBeVisible();
    expect(await emailFormField.fill(otherUserData.email));
    expect(await page.getByText(wrongEmailMsg)).not.toBeVisible();
    expect(await page.getByText(emptyErrorMsg)).not.toBeVisible();
  });
});
