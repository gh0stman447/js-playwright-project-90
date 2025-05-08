import { test, expect } from '@playwright/test';
import { TasksPage } from '../../objectModels';
import { initializePage } from '../../utils';
import { newTaskData } from '../../constants/taskData';

test.describe('Task Editing', () => {
  let taskPage: TasksPage;

  test.beforeEach(async ({ page }) => {
    taskPage = await initializePage<TasksPage>({ page, type: 'tasks' });
  });

  test('should display edit button for each task card', async () => {
    const { desk, editTaskButton } = taskPage;
    const tasks = desk.locator('[data-rfd-draggable-id]');

    const countOfTasks = await tasks.count();

    for (let i = 0; i < countOfTasks; i++) {
      await expect(tasks.nth(i).locator(editTaskButton)).toBeVisible();
    }
  });

  test('should TaskForm display', async ({ page }) => {
    const {
      desk,
      editTaskButton,
      assigneeFormField,
      titleFormField,
      contentFormField,
      saveButton,
      deleteButton,
    } = taskPage;

    const firstTask = desk.locator('[data-rfd-draggable-id]').first();
    const title = await firstTask.locator('.MuiTypography-h5').innerText();
    const description = await firstTask.locator('.MuiTypography-body2').innerText();

    await firstTask.locator(editTaskButton).click();

    const id = page.getByText('Id', { exact: true });
    const createdAd = page.getByText('Created at', { exact: true });

    const formElements = [
      id,
      createdAd,
      assigneeFormField,
      titleFormField,
      contentFormField,
      saveButton,
      deleteButton,
    ];

    for (const element of formElements) {
      await expect(element).toBeVisible();
    }

    await expect(titleFormField).toHaveValue(title);
    await expect(contentFormField).toHaveValue(description);
  });

  test('should update task status and content after editing', async ({ page }) => {
    const { desk, editTaskButton, saveButton, draftColumn, toBeFixedColumn } = taskPage;
    const firstTask = desk.locator('[data-rfd-draggable-id]').first();

    const countOfCardsOfDraftColumnBefore = await draftColumn
      .locator('[data-rfd-draggable-id]')
      .count();

    const countOfCardsOfToBeFixedColumnBefore = await toBeFixedColumn
      .locator('[data-rfd-draggable-id]')
      .count();

    await firstTask.locator(editTaskButton).click();
    await taskPage.fillTaskForm(newTaskData['To Be Fixed']);
    await saveButton.click();
    await page.getByRole('menuitem', { name: 'Tasks' }).click();

    const editedTask = desk.locator('[data-rfd-draggable-id]');
    expect(await editedTask.getByText(newTaskData['To Be Fixed'].title).innerText()).toBe(
      newTaskData['To Be Fixed'].title,
    );

    const countOfCardsOfDraftColumnAfter = await draftColumn
      .locator('[data-rfd-draggable-id]')
      .count();

    const countOfCardsOfToBeFixedColumnAfter = await toBeFixedColumn
      .locator('[data-rfd-draggable-id]')
      .count();

    await expect(editedTask.getByText(newTaskData['To Be Fixed'].title)).toBeVisible();
    await expect(editedTask.getByText(newTaskData['To Be Fixed'].content)).toBeVisible();
    expect(countOfCardsOfDraftColumnBefore).toBe(countOfCardsOfDraftColumnAfter + 1);
    expect(countOfCardsOfToBeFixedColumnBefore).toBe(countOfCardsOfToBeFixedColumnAfter - 1);
  });
});
