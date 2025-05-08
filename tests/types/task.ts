export type TaskStatus = 'Published' | 'To Publish' | 'To Be Fixed' | 'To Review' | 'Draft';

export type TaskLabel = 'critical' | 'task' | 'enhancement' | 'feature' | 'bug';

export interface ITask {
  title: string;
  content: string;
  status: TaskStatus;
  labels: TaskLabel[];
}
