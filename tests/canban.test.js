import { test, expect } from '@playwright/test';
import { MainPage, UsersPage } from './objectModels';
import { authUserData } from './testConstants';

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

test.describe('test SaveForm', () => {
  let usersPage;
  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.login(authUserData.username, authUserData.password);
    usersPage = new UsersPage(page);
    await usersPage.goto();
  });

  test('shoud createUserForm display', async () => {
    const { firstNameFormField, lastNameFormField, emailFormField, createUserButton } = usersPage;

    await createUserButton.click();
    await expect(firstNameFormField).toBeVisible();
    await expect(lastNameFormField).toBeVisible();
    await expect(emailFormField).toBeVisible();
  });

  test('shoud createUserForm save user', async ({ page }) => {
    const {
      firstNameFormField,
      lastNameFormField,
      emailFormField,
      createUserButton,
      saveUserButton,
    } = usersPage;

    await createUserButton.click();
    await emailFormField.fill('User@bk.ru');
    await firstNameFormField.fill('User');
    await lastNameFormField.fill('Userovich');
    await saveUserButton.click();
    await usersPage.goto();
    await expect(page.getByText('User@bk.ru')).toBeVisible();
  });
});
