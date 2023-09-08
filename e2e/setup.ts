import { chromium, firefox, webkit, type FullConfig } from '@playwright/test';
import { CreateFork, createFork, forkRpcUrl } from "./utils/tenderly";

const forkConfig: CreateFork = {
  network_id: '1',
  chain_config: {
    chain_id: 11,
    shanghai_time: 1677557088,
  },
};

const browsers = { chromium, firefox, webkit };
type BrowserName = keyof typeof browsers;

async function globalSetup(config: FullConfig) {
  // const fork = await createFork(forkConfig);
  // const forkId = fork.data.simulation_fork.id;
  const forkId = '15fbbce5-e62b-4262-93ec-0a9747a85ed3';
  process.env['TENDERLY_FORK_ID'] = forkId;
  const rpcUrl = forkRpcUrl(forkId);
  for (const project of config.projects) {
    const { baseURL } = project.use;
    if (!baseURL) continue;
    console.log(project.name, baseURL);
    const browser = await browsers[project.name as BrowserName].launch();
    const page = await browser.newPage();
    await page.goto(`${baseURL}/debug`);
    await page.getByLabel('RPC URL').fill(rpcUrl);
    // TODO: check "unchecked signer"
    await browser.close();
  }
}

export default globalSetup;
