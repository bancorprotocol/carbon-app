import { Locator, Page } from 'playwright-core';
export { prettifyNumber as pn } from '../../src/utils/helpers/number';

export const isCI = !!process.env.CI && process.env.CI !== 'false';
export const isDraft = !!process.env.DRAFT && process.env.DRAFT !== 'false';
export const shouldTakeScreenshot = isCI && !isDraft;

/** Utils to take screenshot on CI that are not draft */
export const screenshot = async (target: Page | Locator, name: string) => {
  if (!shouldTakeScreenshot) return;

  const screenshotStyle = `
  [data-testid="user-wallet"] {
    font-family: monospace !important;
    visibility: hidden !important;
  }
`;

  return target.screenshot({
    path: `e2e/screenshots/${name}.png`,
    animations: 'disabled',
    style: screenshotStyle,
  });
};

const urlNames = {
  '/': 'My Strategies',
  '/trade?*': 'Trade',
  '/explore': 'Explore',
  '/simulate/recurring?*': 'Simulate',
  '/debug': 'Debug',
};

/** Use soft navigation instead of reloading the page. */
export const navigateTo = async (page: Page, url: keyof typeof urlNames) => {
  await page.getByTestId('main-nav').getByText(urlNames[url]).click();
  await page.waitForURL(url);
};

export const waitFor = async (page: Page, testId: string, timeout = 10_000) => {
  const locator = page.getByTestId(testId);
  await locator.waitFor({ state: 'visible', timeout });
  return locator;
};
