import { deleteFork } from '../src/utils/tenderlyApi';

async function globalTeardown() {
  process.env.ForkId && (await deleteFork(process.env.ForkId));
  console.log(process.env.ForkId, '-=-=-=-=-=- Fork Deleted -=-=-=-=-=-');
}

export default globalTeardown;
