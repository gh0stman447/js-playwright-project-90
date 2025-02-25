import { test, expect, Page } from '@playwright/test';
import { authUserData, newUserData, notCorrectUserData, otherUserData } from './constants/userData';
import { LabelsPage, MainPage, StatusesPage, TasksPage, UsersPage } from './objectModels';
import { newStatusData } from './constants/statusData';
import { login } from './utils';
import { newLabelData } from './constants/labelData';
import { newTaskData } from './constants/taskData';

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
    await login(page);
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

        expect(currentRow.locator('td:nth-child(3)')).not.toBe('');
        expect(currentRow.locator('td:nth-child(4)')).not.toBe('');
        expect(currentRow.locator('td:nth-child(5)')).not.toBe('');
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
        showInfoButton,
      } = usersPage;

      await tableBody.locator(`tr`).first().click();
      const uis = [
        emailFormField,
        firstNameFormField,
        lastNameFormField,
        saveUserButton,
        deleteUserButton,
        showInfoButton,
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

test.describe('test labels', () => {
  let labelsPage: LabelsPage;

  test.beforeEach(async ({ page }) => {
    await login(page);
    labelsPage = new LabelsPage(page);
    await labelsPage.goto();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test.describe('test create statusLabel', () => {
    test('should createStutusButton display', async () => {
      const { createLabelButton } = labelsPage;
      await expect(createLabelButton).toBeVisible();
    });

    test('should statusLabelForm display correctly', async () => {
      const { saveLabelButton, nameFormField, tableBody, createLabelButton } = labelsPage;

      await createLabelButton.click();
      await expect(saveLabelButton).toBeVisible();
      await expect(nameFormField).toBeVisible();
    });

    test('should create new statusLabel and check the data display correclty', async () => {
      const { tableBody, createLabelButton, saveLabelButton, page } = labelsPage;
      const countOfLabelsBefore = await tableBody.locator('tr').count();
      await createLabelButton.click();
      await labelsPage.fillLabelForm(newLabelData.name);
      await saveLabelButton.click();
      await page.getByRole('menuitem', { name: 'Labels' }).click();
      const countOfLabelsAfter = await tableBody.locator('tr').count();

      expect(countOfLabelsAfter).toBe(countOfLabelsBefore + 1);

      const newLabel = tableBody.getByRole('row', { name: newLabelData.name });

      await expect(newLabel).toBeVisible();
      expect(await newLabel.locator('td').nth(2).innerText()).toBe(newLabelData.name);
    });
  });

  test.describe('test label list', async () => {
    test('should table header display correctly', async () => {
      const { tableHeader } = labelsPage;

      const headerItems = await tableHeader.locator('th').allTextContents();
      expect(headerItems).toEqual(['', 'Id', 'Name', 'Created at']);

      const checkbox = tableHeader.getByRole('checkbox');

      await expect(checkbox).toBeVisible();
      await expect(checkbox).not.toBeChecked();
    });

    test('should list body display correctly', async () => {
      const { tableBody } = labelsPage;

      const countOfItemsInTable = await tableBody.locator('tr').count();
      expect(countOfItemsInTable).toBe(5);

      for (let i = 1; i <= countOfItemsInTable; i++) {
        const currentRow = tableBody.locator(`tr:nth-child(${i})`);

        const checkbox = currentRow.locator('td').nth(0).getByRole('checkbox');
        const id = currentRow.locator('td').nth(1);
        const name = currentRow.locator('td').nth(2);
        const createdAt = currentRow.locator('td').nth(3);

        const contents = [checkbox, id, name, createdAt];

        for (let j = 0; j < contents.length; j++) {
          if (j === 0) {
            await expect(checkbox).not.toBeChecked();
          }
          await expect(contents[j]).toBeVisible();
          await expect(contents[j]).not.toBeEmpty();
        }
      }
    });

    test('should label list display correctly', async () => {
      const { table } = labelsPage;
      await expect(table).toHaveScreenshot();
    });
  });

  test.describe('test edit labelForm', async () => {
    test('should edit labelForm display correctly', async ({ page }) => {
      const { tableBody, nameFormField, saveLabelButton, deleteLabelButton, showInfoButton } =
        labelsPage;

      const firstLabel = tableBody.locator('tr').first();
      const nameOfFirtLabel = await firstLabel.locator('td').nth(2).textContent();

      await firstLabel.click();
      const uis = [nameFormField, saveLabelButton, deleteLabelButton, showInfoButton];

      for (const ui of uis) {
        await expect(ui).toBeVisible();
      }

      expect(await nameFormField.inputValue()).toBe(nameOfFirtLabel);
    });

    test('should edit labelForm and check the data display correclty', async () => {
      const { saveLabelButton, tableBody } = labelsPage;

      const firstLabel = tableBody.locator('tr').first();
      await firstLabel.click();
      await expect(saveLabelButton).toBeDisabled();
      await labelsPage.fillLabelForm(newLabelData.name);
      await expect(saveLabelButton).toBeEnabled();
      await saveLabelButton.click();
      expect(await firstLabel.locator('td').nth(2).innerText()).toBe(newLabelData.name);
    });
  });

  test.describe('test delete label', async () => {
    test('should be deleted pare of labels correctly', async () => {
      const { tableBody, deleteLabelButton, page } = labelsPage;
      const firstLabel = tableBody.locator('tr').first();
      const countOfLabelsBefore = await tableBody.locator('tr').count();
      const nameOfFirstLabel = (await firstLabel.locator('td').nth(2).textContent()) ?? '';
      await firstLabel.click();
      await deleteLabelButton.click();
      await page.getByRole('menuitem', { name: 'Labels' }).click();
      await expect(tableBody.getByRole('row', { name: nameOfFirstLabel })).not.toBeVisible();

      const countOfLabelsAfter = await tableBody.locator('tr').count();
      expect(countOfLabelsAfter).toBe(countOfLabelsBefore - 1);
    });

    test('should be deleted all labels', async () => {
      const { tableBody, tableHeader, deleteLabelButton, page } = labelsPage;

      const countOfLabelsBefore = await tableBody.locator('tr').count();
      await tableHeader.getByRole('checkbox').click();
      const allLabels = tableBody.locator('tr');

      for (let i = 0; i < (await allLabels.count()); i++) {
        await expect(allLabels.nth(i).getByRole('checkbox')).toBeChecked();
      }

      await deleteLabelButton.click();

      expect(await allLabels.count()).toBe(0);
      await expect(page.getByText('No labels yet')).toBeVisible();
      await expect(page.getByText(`${countOfLabelsBefore} elements deleted`)).toBeVisible();
    });
  });
});

test.describe('test tasks', () => {
  let taskPage: TasksPage;

  test.beforeEach(async ({ page }) => {
    await login(page);
    taskPage = new TasksPage(page);
    await taskPage.goto();
  });

  test.describe('test create task', () => {
    test('should createTaskButton display', async () => {
      const { createTaskButton } = taskPage;
      await expect(createTaskButton).toBeVisible();
    });

    test('should TaskForm display', async () => {
      const {
        assigneeFormField,
        titleFormField,
        contentFormField,
        statusFormField,
        labelFormField,
        saveTaskButton,
        createTaskButton,
      } = taskPage;

      const uis = [
        assigneeFormField,
        titleFormField,
        contentFormField,
        statusFormField,
        labelFormField,
      ];

      await createTaskButton.click();
      for (const ui of uis) {
        await expect(ui).toBeVisible();
      }
      await expect(saveTaskButton).toBeDisabled();
    });

    test('should create new task and check the data display correclty', async () => {
      const { createTaskButton, saveTaskButton, page } = taskPage;
      const publishedColumn = page.locator('[data-rfd-droppable-id]').last();
      const cards = publishedColumn.locator('[data-rfd-draggable-id]');
      const countOfTasksBefore = await cards.count();

      await createTaskButton.click();
      await taskPage.fillTaskForm(newTaskData.Published);
      await saveTaskButton.click();
      await page.getByRole('menuitem', { name: 'Tasks' }).click();
      const countOfTasksAfter = await cards.count();
      console.log(countOfTasksBefore, countOfTasksAfter);

      expect(countOfTasksAfter).toBe(countOfTasksBefore + 1);

      const newTask = cards.locator('div');

      await expect(newTask.getByText(newTaskData.Published.title)).toBeVisible();
      await expect(newTask.getByText(newTaskData.Published.content)).toBeVisible();
    });
  });
});
