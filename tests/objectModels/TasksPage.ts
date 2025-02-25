import { Locator, Page } from '@playwright/test';
import { baseUrl } from '../constants/baseUrl';

export type TTaskForm = {
  title: string;
  content: string;
  status: 'Published' | 'To Publish' | 'To Be Fixed' | 'To Review' | 'Draft';
  labels: ('critical' | 'task' | 'enhancement' | 'feature' | 'bug')[];
};

export class TasksPage {
  public page: Page;
  public createTaskButton: Locator;
  public editTaskButton: Locator;
  public desk: Locator;
  public deskActions: Locator;

  public titleFormField: Locator;
  public assigneeFormField: Locator;
  public contentFormField: Locator;
  public statusFormField: Locator;
  public labelFormField: Locator;
  public saveTaskButton: Locator;

  //edit
  public deleteTaskButton: Locator;
  public showInfoButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createTaskButton = this.page.getByRole('link', { name: 'Create' });
    this.editTaskButton = this.page.getByRole('link', { name: 'Edit' });
    this.desk = this.page.locator('.RaList-content');
    this.deskActions = this.page.locator('.RaList-actions');

    //Form
    this.assigneeFormField = this.page.getByRole('combobox', { name: 'Assignee' });
    this.titleFormField = this.page.getByRole('textbox', { name: 'Title' });
    this.contentFormField = this.page.getByRole('textbox', { name: 'Content' });
    this.statusFormField = this.page.getByRole('combobox', { name: 'Status' });
    this.labelFormField = this.page.getByRole('combobox', { name: 'Label' });
    this.saveTaskButton = this.page.getByRole('button', { name: 'Save' });

    this.deleteTaskButton = this.page.getByRole('button', { name: 'Delete' });
    this.showInfoButton = this.page.getByRole('link', { name: 'Show' });
  }

  async goto() {
    await this.page.goto(`${baseUrl}/#/tasks`);
  }

  async fillTaskForm({ title, content, status, labels }: TTaskForm) {
    await this.assigneeFormField.click();
    await this.page.getByRole('option').nth(0).click();

    await this.titleFormField.fill(title);

    await this.contentFormField.fill(content);

    await this.statusFormField.click();
    await this.page.getByRole('option', { name: status }).click();
    console.log(this.page.getByRole('option', { name: status }));

    await this.labelFormField.click();
    for (const item of labels) {
      console.log(item);
      await this.page.getByRole('option', { name: item }).click();
    }
    await this.page.keyboard.press('Escape');
  }

  //   async clearTaskForm() {
  //     await this.nameFormField.clear();
  //   }
}
