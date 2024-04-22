import { Page } from '@playwright/test';

/**
 * Mocks the Date constructor and Date.now(), replaces them by fakeDate.
 * Works by adding an init script to the page, which runs before navigating to it.
 * ```js
 * import { test } from '@playwright/test';
 *
 * test.beforeEach(async ({ page }) => {
 *   await mockDate(page, '2024-03-01T00:00:00.000Z')
 * });
 * ```
 *
 * @param page Page object to mock
 * @param fakeDate Date in string form, e.g. '2024-03-01T00:00:00.000Z'
 */
export const mockDate = async (page: Page, fakeDate: string) => {
  const fakeNow = new Date(fakeDate).valueOf();
  await page.addInitScript(`{
    // Extend Date constructor to default to fakeNow
    Date = class extends Date {
        constructor(...args) {
      if (args.length === 0) {
        super(${fakeNow});
       } else {
          super(...args);
        }
      }
    }
    // Override Date.now() to start from fakeNow
    const __DateNowOffset = ${fakeNow} - Date.now();
    const __DateNow = Date.now;
    Date.now = () => __DateNow() + __DateNowOffset;
    }`);
};
