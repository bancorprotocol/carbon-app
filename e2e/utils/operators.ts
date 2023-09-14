import { Locator, Page } from 'playwright-core';

export const isCI = !!process.env.CI && process.env.CI !== 'false';
export const isDraft = !!process.env.DRAFT && process.env.DRAFT !== 'false';

/** Utils to take screenshot on CI that are not draft */
export const screenshot = (target: Page | Locator, name: string) => {
  if (!isCI || isDraft) return;
  return target.screenshot({
    type: 'jpeg',
    path: `e2e/screenshots/${name}.jpg`,
  });
};
