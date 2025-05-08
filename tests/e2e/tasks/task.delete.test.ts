import { test, expect } from '@playwright/test';
import { TasksPage } from '../../objectModels';
import { initializePage } from '../../utils';

test.describe('Task Deletion', () => {
  let taskPage: TasksPage;

  test.beforeEach(async ({ page }) => {
    taskPage = await initializePage<TasksPage>({ page, type: 'tasks' });
  });

  test('should delete task', async ({ page }) => {
    const { desk, editTaskButton, deleteButton } = taskPage;
    const toReviewTask = desk.locator('[data-rfd-draggable-id]').nth(3);

    const countOfCardsOfToReviewColumnBefore = await page
      .locator('[data-rfd-droppable-id="2"]')
      .locator('[data-rfd-draggable-id]')
      .count();

    const title = await toReviewTask.locator('.MuiTypography-h5').innerText();

    await toReviewTask.locator(editTaskButton).click();
    await deleteButton.click();

    const countOfCardsOfToReviewColumnAfter = await page
      .locator('[data-rfd-droppable-id="2"]')
      .locator('[data-rfd-draggable-id]')
      .count();

    await expect(page.getByText(title)).not.toBeVisible();
    expect(countOfCardsOfToReviewColumnBefore).toBe(countOfCardsOfToReviewColumnAfter + 1);
    await expect(page.getByText('Element deleted')).toBeVisible();
  });
});
