import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ITask } from '../types/task';

export class TasksPage extends BasePage {
  public titleFormField: Locator;
  public assigneeFormField: Locator;
  public contentFormField: Locator;
  public statusFormField: Locator;
  public labelFormField: Locator;
  public desk: Locator;
  public deskActions: Locator;
  public editTaskButton: Locator;

  //Cols
  public draftColumn: Locator;
  public toPublishColumn: Locator;
  public toBeFixedColumn: Locator;
  public toReviewColumn: Locator;
  public publishedColumn: Locator;

  constructor(page: Page) {
    super(page);
    this.desk = this.page.locator('.RaList-content');
    this.deskActions = this.page.locator('.RaList-actions');
    this.editTaskButton = this.page.getByRole('link', { name: 'Edit' });
    this.assigneeFormField = this.page.getByRole('combobox', { name: 'Assignee' });
    this.titleFormField = this.page.getByRole('textbox', { name: 'Title' });
    this.contentFormField = this.page.getByRole('textbox', { name: 'Content' });
    this.statusFormField = this.page.getByRole('combobox', { name: 'Status' });
    this.labelFormField = this.page.getByRole('combobox', { name: 'Label' });

    //Cols
    this.draftColumn = this.page.locator('[data-rfd-droppable-id]').first();
    this.toReviewColumn = this.page.locator('[data-rfd-droppable-id]').nth(1);
    this.toBeFixedColumn = this.page.locator('[data-rfd-droppable-id]').nth(2);
    this.toPublishColumn = this.page.locator('[data-rfd-droppable-id]').nth(3);
    this.publishedColumn = this.page.locator('[data-rfd-droppable-id]').last();
  }

  protected getUrl(): string {
    return '/#/tasks';
  }

  async fillTaskForm({ title, content, status, labels }: ITask) {
    await this.assigneeFormField.click();
    await this.page.getByRole('option').nth(0).click();

    await this.titleFormField.fill(title);
    await this.contentFormField.fill(content);

    await this.statusFormField.click();
    await this.page.getByRole('option', { name: status }).click();

    await this.labelFormField.click();
    for (const item of labels) {
      await this.page.getByRole('option', { name: item }).click();
    }
    await this.page.keyboard.press('Escape');
  }

  async clearTaskForm() {
    await this.clearForm([
      this.titleFormField,
      this.contentFormField,
      this.statusFormField,
      this.labelFormField,
    ]);
  }
}
