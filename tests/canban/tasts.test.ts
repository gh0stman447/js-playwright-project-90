import { test, expect } from '@playwright/test';
import { TasksPage } from '../objectModels';
import { login } from '../utils';
import { newTaskData } from '../constants/taskData';

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

  test.describe('test edit task', async () => {
    test('should editTaskButton display', async () => {
      const { desk, editTaskButton } = taskPage;

      const firstTask = desk.locator('[data-rfd-draggable-id]').first();
      await expect(firstTask.locator(editTaskButton)).toBeVisible();
    });

    test('should TaskForm display', async () => {
      const {
        desk,
        editTaskButton,
        assigneeFormField,
        titleFormField,
        contentFormField,
        saveTaskButton,
        deleteTaskButton,
        page,
      } = taskPage;
      const firstTask = desk.locator('[data-rfd-draggable-id]').first();
      const title = await firstTask.locator('.MuiTypography-h5').innerText();
      const description = await firstTask.locator('.MuiTypography-body2').innerText();

      await firstTask.locator(editTaskButton).click();

      const id = page.getByText('Id', { exact: true });
      const createdAd = page.getByText('Created at', { exact: true });

      const uis = [
        id,
        createdAd,
        assigneeFormField,
        titleFormField,
        contentFormField,
        saveTaskButton,
        deleteTaskButton,
      ];

      for (const ui of uis) {
        await expect(ui).toBeVisible();
      }

      await expect(titleFormField).toHaveValue(title);
      await expect(contentFormField).toHaveValue(description);
    });

    test('should edit task and check the data display correclty', async () => {
      const { desk, editTaskButton, saveTaskButton, page } = taskPage;
      const firstTask = desk.locator('[data-rfd-draggable-id]').first();

      const draftColumn = page.locator('[data-rfd-droppable-id="1"]');
      const toBeFixedColumn = page.locator('[data-rfd-droppable-id="3"]');

      const countOfCardsOfDraftColumnBefore = await draftColumn
        .locator('[data-rfd-draggable-id]')
        .count();

      const countOfCardsOfToBeFixedColumnBefore = await toBeFixedColumn
        .locator('[data-rfd-draggable-id]')
        .count();

      await firstTask.locator(editTaskButton).click();
      await taskPage.fillTaskForm(newTaskData['To Be Fixed']);
      await saveTaskButton.click();

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

    test('should delete task', async () => {
      const { desk, editTaskButton, page, deleteTaskButton } = taskPage;

      const toReviewTask = desk.locator('[data-rfd-draggable-id]').nth(3);

      const countOfCardsOfToReviewColumnBefore = await page
        .locator('[data-rfd-droppable-id="2"]')
        .locator('[data-rfd-draggable-id]')
        .count();

      const title = await toReviewTask.locator('.MuiTypography-h5').innerText();

      await toReviewTask.locator(editTaskButton).click();
      await deleteTaskButton.click();

      const countOfCardsOfToReviewColumnAfter = await page
        .locator('[data-rfd-droppable-id="2"]')
        .locator('[data-rfd-draggable-id]')
        .count();

      await expect(page.getByText(title)).not.toBeVisible();

      expect(countOfCardsOfToReviewColumnBefore).toBe(countOfCardsOfToReviewColumnAfter + 1);
      await expect(page.getByText('Element deleted')).toBeVisible();
    });
  });
});
