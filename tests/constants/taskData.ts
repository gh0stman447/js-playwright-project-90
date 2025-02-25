import { TTaskForm } from '../objectModels/TasksPage';

const title = 'New title';
const content = 'New content';

export const newTaskData: Record<TTaskForm['status'], TTaskForm> = {
  Published: {
    title,
    content,
    status: 'Published',
    labels: ['critical', 'bug'],
  },
  'To Be Fixed': {
    title,
    content,
    status: 'To Be Fixed',
    labels: ['feature'],
  },
  'To Publish': {
    title,
    content,
    status: 'To Publish',
    labels: ['task', 'enhancement'],
  },

  'To Review': {
    title,
    content,
    status: 'To Review',
    labels: ['feature', 'bug'],
  },

  Draft: {
    title,
    content,
    status: 'Draft',
    labels: ['bug'],
  },
};
