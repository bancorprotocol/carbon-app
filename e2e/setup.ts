import { chromium, firefox, webkit, type FullConfig } from '@playwright/test';
import { CreateForkBody, createFork, forkRpcUrl } from './utils/tenderly';

const forkConfig: CreateForkBody = {
  network_id: '1',
  alias: 'E2E-CI',
};

const browsers = { chromium, firefox, webkit };
type BrowserName = keyof typeof browsers;

async function globalSetup(config: FullConfig) {
  console.log('Setting up the Tenderly');
  console.time('Fork is setup');

  // Create a Fork
  const fork = await createFork(forkConfig);
  process.env['TENDERLY_FORK_ID'] = fork.id;
  const rpcUrl = forkRpcUrl(fork.id);
  // TODO: update if needed
  const imposter = '0x4a3ca0cb4dcf6bc573ca4b538cab5fb0e01b5f19';

  // On each browser, fill the Debug form and save localStorage in storageState
  const setupProjects = config.projects.map(async (project) => {
    if (!(project.name in browsers)) return;
    const { baseURL, storageState } = project.use;
    if (!baseURL) return;

    const browser = await browsers[project.name as BrowserName].launch();
    const page = await browser.newPage();
    await page.goto(`${baseURL}/debug`);
    // SET RPC-URL
    await page.getByLabel('RPC URL').fill(rpcUrl);
    await page.getByTestId('unchecked-signer').click();
    await page.getByTestId('save-rpc').click();
    await page.waitForURL(`${baseURL}/debug`);

    // SET Imposter Account
    await page.getByLabel('Imposter Account').fill(imposter);
    await page.getByTestId('save-imposter').click();

    await page.context().storageState({ path: storageState as string });
    await browser.close();
  });
  await Promise.all(setupProjects);
  console.timeEnd('Fork is setup');
}

export default globalSetup;
