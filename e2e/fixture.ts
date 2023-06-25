import { setupBeforeEach } from './test-setup';
import { test as base } from '@playwright/test';

export const newTest = base.extend({
  auth: async ({ page }, use) => {
    await setupBeforeEach(page);
    await use(page);
  },
});
