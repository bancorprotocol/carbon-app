import { chromium, firefox, webkit, type FullConfig } from '@playwright/test';

const browsers = { chromium, firefox, webkit };
type BrowserName = keyof typeof browsers;

async function globalSetup(config: FullConfig) {
  const setupProjects = config.projects.map(async (project) => {
    if (!(project.name in browsers)) return;
    const { baseURL, storageState } = project.use;
    if (!baseURL) return;

    const browser = await browsers[project.name as BrowserName].launch();
    const page = await browser.newPage();
    await page.goto(`${baseURL}/debug`);
    await page.context().storageState({ path: storageState as string });
    await browser.close();
  });
  await Promise.all(setupProjects);
}

export default globalSetup;
