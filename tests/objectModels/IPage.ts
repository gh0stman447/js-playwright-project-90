import { Page } from '@playwright/test';

export interface IPage {
  page: Page;
  goto(): Promise<void>;
}
