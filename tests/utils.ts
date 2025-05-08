import { Page, TestInfo } from '@playwright/test';
import { LabelsPage, LoginPage, StatusesPage, TasksPage, UsersPage } from './objectModels';
import { authUserData } from './constants/userData';
import { BasePage } from './objectModels/BasePage';
import { TPage } from './types/page';
import { IPage } from './objectModels/IPage';

export const login = async (page: Page) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(authUserData.username, authUserData.password);
};

export const switchTheme = async (page: Page) => {
  await page.getByLabel('Toggle light/dark mode').click();
};

export const initializePage = async <T extends IPage>({
  page,
  type,
  shouldLogin = true,
}: {
  page: Page;
  type: TPage;
  shouldLogin?: boolean;
}) => {
  let initPage: IPage;

  shouldLogin && (await login(page));

  switch (type) {
    case 'users':
      initPage = new UsersPage(page);
      break;
    case 'labels':
      initPage = new LabelsPage(page);
      break;
    case 'tasks':
      initPage = new TasksPage(page);
      break;
    case 'statuses':
      initPage = new StatusesPage(page);
      break;
    case 'login':
      initPage = new LoginPage(page);
      break;
    default:
      throw new Error(`Unknown page type: ${type}`);
  }

  await initPage.goto();
  return initPage as T;
};

/**
 * Ожидание в ms
 * @param ms
 */
export const wait = async (ms: number) => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export function addTestAnnotation(
  testInfo: TestInfo,
  data: { type?: string; description?: string } | string,
) {
  if (typeof data === 'string') {
    // Если data - строка, добавляем аннотацию с пустым типом.
    testInfo.annotations.push({ type: '', description: data });
  } else {
    // Если data - объект, добавляем аннотацию с указанными типом и описанием.
    testInfo.annotations.push({
      type: data.type ?? '',
      description: data.description,
    });
  }
}

export function addTestBehavior(testInfo: TestInfo, data: string | string[]) {
  if (!Array.isArray(data)) {
    data = [data]; // Приведение к массиву, если data - не массив.
  }

  data.forEach((description, idx) => {
    // Добавляем аннотацию для каждого описания поведения.
    addTestAnnotation(testInfo, {
      type: idx === 0 ? 'Поведение' : '',
      description,
    });
  });
}
