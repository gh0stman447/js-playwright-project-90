import { test, expect, Page } from '@playwright/test';
import { authUserData, newUserData, notCorrectUserData, otherUserData } from './constants/userData';
import { MainPage, StatusesPage, UsersPage } from './objectModels';
import { newStatusData } from './constants/statusData';

test.describe('test login', () => {
  let mainPage: MainPage;
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

test.describe('test users', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.login(authUserData.username, authUserData.password);
    usersPage = new UsersPage(page);
    await usersPage.goto();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test.describe('test createUser', () => {
    test('should createUserButton display', async () => {
      const { createUserButton } = usersPage;
      await expect(createUserButton).toBeVisible();
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

      await usersPage.fillUserForm(newUserData.email, newUserData.firstName, newUserData.lastName);

      await saveUserButton.click();
      await showInfoButton.click();

      await expect(page.getByText(newUserData.email, { exact: true })).toBeVisible();
      await expect(page.getByText(newUserData.firstName, { exact: true })).toBeVisible();
      await expect(page.getByText(newUserData.lastName, { exact: true })).toBeVisible();

      await usersPage.goto();
      await expect(page.getByText('User@bk.ru')).toBeVisible();
    });
  });

  test.describe('test userTable', async () => {
    test('should userTable display', async ({ page }) => {
      const { table, tableHeader, tableBody, countItemsSelector } = usersPage;

      await expect(table).toBeVisible();
      const headerItems = await tableHeader.locator('th').allTextContents();

      expect(headerItems).toEqual(['', 'Id', 'Email', 'First name', 'Last name', 'Created at']);
      expect(await tableBody.locator('tr').count()).toBe(8);
      await countItemsSelector.click();
      await page.getByRole('option', { name: '5', exact: true }).click();
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
    test('should edit userForm display correctly', async ({ page }) => {
      const {
        tableBody,
        emailFormField,
        firstNameFormField,
        lastNameFormField,
        saveUserButton,
        deleteUserButton,
      } = usersPage;

      await tableBody.locator(`tr`).first().click();
      const uis = [
        emailFormField,
        firstNameFormField,
        lastNameFormField,
        saveUserButton,
        deleteUserButton,
      ];

      for (const ui of uis) {
        await expect(ui).toBeVisible();
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
      await expect(page.getByText(emptyErrorMsg)).not.toBeVisible();
      expect(await emailFormField.fill(otherUserData.email));
      await expect(page.getByText(wrongEmailMsg)).not.toBeVisible();
      await expect(page.getByText(emptyErrorMsg)).not.toBeVisible();
    });
  });

  test.describe('test delete user', async () => {
    test('should delete user', async ({ page }) => {
      const { tableBody, deleteUserButton } = usersPage;

      await tableBody.locator('tr').first().click();
      await deleteUserButton.click();

      await expect(page.getByText('john@google.com', { exact: true })).not.toBeVisible();
      await expect(tableBody.locator('tr')).toHaveCount(7);

      await tableBody.locator('tr').nth(0).getByRole('checkbox').check();
      await deleteUserButton.click();

      await expect(tableBody.locator('tr')).toHaveCount(6);
      await expect(page.getByText('jack@yahoo.com', { exact: true })).not.toBeVisible();
    });

    test('should highlight all users when clicking on the delete button', async ({ page }) => {
      const { tableBody, tableHeader } = usersPage;

      await tableHeader.locator('th').getByRole('checkbox', { name: 'Select all' }).check();

      const rows = await tableBody.locator('row').count();

      for (let i = 0; i < rows; i++) {
        await expect(tableBody.locator('tr').nth(i).getByRole('checkbox')).not.toBeChecked();
      }
    });

    test('should delete all users after clicking on the deleteAllUsers button', async ({
      page,
    }) => {
      const { tableHeader, deleteUserButton, tableBody, countItemsSelector } = usersPage;

      await tableHeader.locator('th').getByRole('checkbox', { name: 'Select all' }).check();

      await countItemsSelector.click();
      await page.getByRole('option', { name: '50' }).click();
      await deleteUserButton.click();
      expect(await tableBody.locator('tr').count()).toBe(0);
      await expect(page.getByText('No Users yet.')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Create' })).toBeVisible();
    });
  });
});

test.describe('test statuses', () => {
  let statusesPage: StatusesPage;

  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.login(authUserData.username, authUserData.password);
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
    test('should status list display correctly', async ({ page }) => {
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
      const { tableBody, nameFormField, slugFormField, saveStatusButton, deleteStatusButton } =
        statusesPage;

      const firstStatus = tableBody.locator('tr').first();
      const nameOfFirstStatus = await firstStatus.locator('td').nth(2).textContent();
      const slugOfFirstStatus = await firstStatus.locator('td').nth(3).textContent();
      console.log(nameOfFirstStatus, slugOfFirstStatus);

      expect(await tableBody.locator('tr').first().click());
      const uis = [nameFormField, slugFormField, saveStatusButton, deleteStatusButton];

      for (let ui of uis) {
        await expect(ui).toBeVisible();
      }

      expect(await nameFormField.inputValue()).toBe(nameOfFirstStatus);
      expect(await slugFormField.inputValue()).toBe(slugOfFirstStatus);
    });

    test('should be edited status correctly', async () => {
      const { tableBody, saveStatusButton } = statusesPage;
      const firstStatus = tableBody.locator('tr').first();

      const nameOfFirstStatus = firstStatus.locator('td').nth(2);
      const slugOfFirstStatus = firstStatus.locator('td').nth(3);

      await firstStatus.click();

      await statusesPage.fillStatusForm(newStatusData.name, newStatusData.slug);
      await saveStatusButton.click();

      await statusesPage.page.getByRole('menuitem', { name: 'Task statuses' }).click();

      await expect(nameOfFirstStatus).toHaveText(newStatusData.name);
      await expect(slugOfFirstStatus).toHaveText(newStatusData.slug);
    });
  });
});
