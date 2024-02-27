import {
  Locator,
  Page,
  LocatorScreenshotOptions,
  PageScreenshotOptions,
} from 'playwright-core';
export { prettifyNumber as pn } from '../../src/utils/helpers/number';

export const isCI = !!process.env.CI && process.env.CI !== 'false';
export const isDraft = !!process.env.DRAFT && process.env.DRAFT !== 'false';
export const shouldTakeScreenshot = isCI && !isDraft;

function isPage(page: Page | Locator): page is Page {
  return (page as Page).url !== undefined;
}

// Takes a screenshot of elements outside of the viewport
export const screenshotFullScreen = async (
  target: Page | Locator,
  name: string
) => {
  if (!shouldTakeScreenshot) return;

  const screenshotCommonParams:
    | PageScreenshotOptions
    | LocatorScreenshotOptions = {
    type: 'jpeg',
    path: `e2e/screenshots/${name}.jpg`,
    maskColor: '#303030',
  };

  if (isPage(target)) {
    return await target.screenshot({
      ...screenshotCommonParams,
      mask: [target.getByTestId('user-wallet')],
      fullPage: true,
    });
  }
  const page = target.page();
  const targetBox = await target.boundingBox();

  const fullPageSize = await page.evaluate(() => {
    return {
      width: Math.max(
        document.documentElement.scrollWidth +
          document.documentElement.scrollLeft
      ),
      height: Math.max(
        document.documentElement.scrollHeight +
          document.documentElement.scrollTop
      ),
    };
  });

  const newViewportSize = {
    width: Math.max(fullPageSize.width, targetBox?.width || 0),
    height: Math.max(fullPageSize.height, targetBox?.height || 0),
  };

  const originalSize = page.viewportSize();
  if (!originalSize) throw Error('Could not get page viewportSize()');

  await page.setViewportSize(newViewportSize);
  const fullPageScreenshot = await target.screenshot({
    ...screenshotCommonParams,
    mask: [page.getByTestId('user-wallet')],
  });
  await page.setViewportSize(originalSize);
  return fullPageScreenshot;
};

/** Utils to take screenshot on CI that are not draft */
export const screenshot = (target: Page | Locator, name: string) => {
  if (!shouldTakeScreenshot) return;
  return target.screenshot({
    type: 'jpeg',
    path: `e2e/screenshots/${name}.jpg`,
    mask: [target.getByTestId('user-wallet')],
    maskColor: '#303030',
  });
};

const urlNames = {
  '/': 'My Strategies',
  '/trade?*': 'Trade',
  '/explorer': 'Explorer',
  '/debug': 'Debug',
  '/simulator/recurring': 'Simulator',
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
