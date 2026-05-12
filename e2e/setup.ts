import { chromium, firefox, webkit, type FullConfig } from '@playwright/test';

const browsers = { chromium, firefox, webkit };
type BrowserName = keyof typeof browsers;

const tenderlyId = 'd0852fd4-e587-4826-8765-9c80348cec8d';
const apiUrl = `${process.env.BACKEND_TENDERLY_API}/preview/backends`;

const doesBackendExist = async () => {
  const res = await fetch(`${apiUrl}/${tenderlyId}`);
  const result = await res.json();
  return result.status === 'ready';
};

const waitForBackend = async () => {
  const res = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify({ tenderlyId }),
  });
  if (!res.ok) throw new Error('Could not create backend');
  const max = Date.now() + 10 * 60 * 1000; // in 10min
  let ready = false;
  while (!ready && max > Date.now()) {
    await new Promise((res) => setTimeout(res, 30_000)); // every 30sec
    ready = await doesBackendExist();
  }
  if (!ready)
    throw new Error('Timedout: wait too long for backend to be creating');
};

async function globalSetup(config: FullConfig) {
  const setupProjects = config.projects.map(async (project) => {
    if (!(project.name in browsers)) return;
    const { baseURL, storageState } = project.use;
    if (!baseURL) return;

    // create RPC if do not exist
    const backendExist = doesBackendExist();
    if (!backendExist) {
      await waitForBackend();
    }

    const browser = await browsers[project.name as BrowserName].launch();
    const page = await browser.newPage();
    await page.goto(`${baseURL}/debug`);
    await page.context().storageState({ path: storageState as string });
    await browser.close();
  });
  await Promise.all(setupProjects);
}

export default globalSetup;
