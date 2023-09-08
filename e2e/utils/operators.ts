import { Locator, Page } from 'playwright-core';

export const isCI = !!process.env.CI && process.env.CI !== 'false';

export const screenshot = (target: Page | Locator, name: string) => {
  return target.screenshot({
    type: 'jpeg',
    path: `e2e/screenshots/${name}.jpg`,
  });
};
