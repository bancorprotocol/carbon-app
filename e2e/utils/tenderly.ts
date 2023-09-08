const TENDERLY_USER = process.env['TENDERLY_USER'];
const TENDERLY_ACCESS_KEY = process.env['TENDERLY_ACCESS_KEY'];

if (!TENDERLY_USER) throw new Error('No TENDERLY_USER provided in .env');
if (!TENDERLY_ACCESS_KEY) throw new Error('No TENDERLY_ACCESS_KEY provided in .env');

const TENDERLY_PROJECT = 'carbon';
const baseUrl = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/fork`;
const headers = {
  'X-Access-Key': TENDERLY_ACCESS_KEY,
};

export interface CreateFork {
  /** ChainID in decimal: "1" for mainnet */
  network_id: string;
  block_number?: number;
  chain_config?: {
    chain_id: number;
    shanghai_time: number;
  };
}

export const forkRpcUrl = (forkId: string) => {
  return `https://rpc.tenderly.co/fork/${forkId}`;
};

export const createFork = async (params: CreateFork) => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify(params),
    headers,
  });
  if (!res.ok) return res.json();
  throw new Error(res.statusText);
};

export const getFork = async (forkId: string) => {
  const res = await fetch(`${baseUrl}/${forkId}`, {
    method: 'GET',
    headers,
  });
  if (!res.ok) return res.json();
  throw new Error(res.statusText);
};

export const deleteFork = async (forkId: string) => {
  const res = await fetch(`${baseUrl}/${forkId}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) return res.json();
  throw new Error(res.statusText);
};
