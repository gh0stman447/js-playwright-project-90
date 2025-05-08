import { test, expect } from '@playwright/test';
import { TasksPage } from '../../objectModels';
import { initializePage } from '../../utils';
import { newTaskData } from '../../constants/taskData';

test.describe('Task Creation', () => {
  let taskPage: TasksPage;

  test.beforeEach(async ({ page }) => {
    taskPage = await initializePage<TasksPage>({ page, type: 'tasks' });
  });

  test('should createTaskButton display', async () => {
    await expect(taskPage.createButton).toBeVisible();
  });

  test('should TaskForm display', async () => {
    const {
      assigneeFormField,
      titleFormField,
      contentFormField,
      statusFormField,
      labelFormField,
      saveButton,
      createButton,
    } = taskPage;

    const formFields = [
      assigneeFormField,
      titleFormField,
      contentFormField,
      statusFormField,
      labelFormField,
    ];

    await createButton.click();
    for (const field of formFields) {
      await expect(field).toBeVisible();
    }
    await expect(saveButton).toBeDisabled();
  });

  test('should create new task and check the data display correctly', async ({ page }) => {
    const { createButton, saveButton, publishedColumn } = taskPage;
    const publishedCards = publishedColumn.locator('[data-rfd-draggable-id]');
    const countOfTasksBefore = await publishedCards.count();

    await createButton.click();
    await taskPage.fillTaskForm(newTaskData.Published);
    await saveButton.click();
    await page.getByRole('menuitem', { name: 'Tasks' }).click();
    const countOfTasksAfter = await publishedCards.count();

    expect(countOfTasksAfter).toBe(countOfTasksBefore + 1);

    const newTask = publishedCards.locator('div');
    await expect(newTask.getByText(newTaskData.Published.title)).toBeVisible();
    await expect(newTask.getByText(newTaskData.Published.content)).toBeVisible();
  });
});
