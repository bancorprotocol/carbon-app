import { deleteFork } from '../src/utils/tenderlyApi';
import { setupBeforeEach } from './test-setup';
import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    const forkIdCreated = await setupBeforeEach(page);
    await use(page);
    await deleteFork(forkIdCreated);
    console.log(forkIdCreated, '-=-=-=-=-=- Fork Deleted -=-=-=-=-=-');
  },
});
