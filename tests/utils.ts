import { Page } from '@playwright/test';
import { MainPage } from './objectModels';
import { authUserData } from './constants/userData';

export const login = async (page: Page) => {
  const mainPage = new MainPage(page);
  await mainPage.goto();
  await mainPage.login(authUserData.username, authUserData.password);
};
