import { deleteFork } from './utils/tenderly';

const globalTeardown = async () => {
  console.log('Removing current fork');
  console.time('Fork removed');

  const forkId = process.env['TENDERLY_FORK_ID'];
  if (forkId) await deleteFork(forkId);

  console.timeEnd('Fork removed');
};

export default globalTeardown;
