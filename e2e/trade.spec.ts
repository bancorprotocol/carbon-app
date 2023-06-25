import { expect } from '@playwright/test';
// import { setupAfterEach, setupBeforeEach } from './test-setup';
import { newTest } from './fixture';

newTest.describe('Trade page', () => {
  newTest('Trade snapshot', async ({ auth }) => {
    await auth.goto('/trade');
    await auth
      .getByTestId('logo-animation')
      .last()
      .waitFor({ state: 'hidden' });

    await expect(await auth.screenshot()).toMatchSnapshot('trade.png');
  });
});
