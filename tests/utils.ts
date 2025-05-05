import { Page, TestInfo } from '@playwright/test';
import { LoginPage } from './objectModels';
import { authUserData } from './constants/userData';

export const login = async (page: Page) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(authUserData.username, authUserData.password);
};

export const switchTheme = async (page: Page) => {
  await page.getByLabel('Toggle light/dark mode').click();
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
