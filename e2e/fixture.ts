import { deleteFork } from '../src/utils/tenderlyApi';
import { setupBeforeEach } from './test-setup';
import { test } from '@playwright/test';

export const cleanForkTest = test.extend({
  page: async ({ page }, use) => {
    const forkIdCreated = await setupBeforeEach(page);
    try {
      await use(page);
    } finally {
      await deleteFork(forkIdCreated);
      console.log(forkIdCreated, '-=-=-=-=-=- Fork Deleted -=-=-=-=-=-');
    }
  },
});
