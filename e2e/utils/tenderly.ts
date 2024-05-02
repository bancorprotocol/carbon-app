import { Page } from '@playwright/test';

const TENDERLY_ACCOUNT = process.env['TENDERLY_ACCOUNT'];
if (!TENDERLY_ACCOUNT) throw new Error('No TENDERLY_ACCOUNT provided in .env');
const TENDERLY_PROJECT = process.env['TENDERLY_PROJECT'];
if (!TENDERLY_PROJECT) throw new Error('No TENDERLY_PROJECT provided in .env');
const TENDERLY_ACCESS_KEY = process.env['TENDERLY_ACCESS_KEY'];
if (!TENDERLY_ACCESS_KEY)
  throw new Error('No TENDERLY_ACCESS_KEY provided in .env');

const baseUrl = `https://api.tenderly.co/api/v1/account/${TENDERLY_ACCOUNT}/project/${TENDERLY_PROJECT}/fork`;
const headers = {
  'Content-Type': 'application/json',
  'X-Access-Key': TENDERLY_ACCESS_KEY,
};

export const forkRpcUrl = (forkId: string) => {
  return `https://rpc.tenderly.co/fork/${forkId}`;
};

interface ChainConfig {
  type: string; // 'ethereum' | ...
  chain_id: number;
  homestead_block: number;
  dao_fork_block: number;
  dao_fork_support: boolean;
  eip_150_block: number;
  eip_150_hash: string;
  eip_155_block: number;
  eip_158_block: number;
  byzantium_block: number;
  constantinople_block: number;
  petersburg_block: number;
  istanbul_block: number;
  berlin_block: number;
  london_block: number;
  shanghai_time: number;
  polygon: {
    heimdall_url: string;
    sprint_length_changelog: string | null;
    state_sync: {
      do_not_skip: boolean;
      event_records_amount_override: number | null;
    };
  };
}

interface Fork {
  id: string;
  project_id: string;
  alias: string;
  network_id: string;
  block_number: number;
  transaction_index: number;
  chain_config: ChainConfig | null;
  fork_config: any | null;
  created_at: string;
  accounts: Record<string, string>; // Record<address, privateKey>
  global_head: string;
  current_block_number: number;
  shared: boolean;
}

export interface CreateForkBody {
  /** ChainID in decimal: "1" for mainnet */
  network_id: string;
  alias?: string;
  block_number?: number;
  chain_config?: Partial<ChainConfig>;
}

export interface CreateForkResponse {
  simulation_fork: Fork;
  root_transaction: any;
}

export const createFork = async (body: CreateForkBody) => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  });
  if (!res.ok) return tenderlyError(res);
  const result: CreateForkResponse = await res.json();
  return result.simulation_fork;
};

export interface GetForkResponse {
  simulation_fork: Fork;
}

export const waitForTenderlyRpc = (page: Page, timeout?: number) => {
  const tenderlyRegExp = /.*rpc\.tenderly\.co\/fork.*$/;
  return page.waitForResponse(tenderlyRegExp, { timeout });
};

export const getFork = async (forkId: string) => {
  const res = await fetch(`${baseUrl}/${forkId}`, {
    method: 'GET',
    headers,
  });
  if (!res.ok) return tenderlyError(res);
  const result: GetForkResponse = await res.json();
  return result.simulation_fork;
};

export const deleteFork = async (forkId: string) => {
  const res = await fetch(`${baseUrl}/${forkId}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) return tenderlyError(res);
  // Delete returns No Content
};

interface TenderlyError {
  id: string;
  slug: string;
  message: string;
}
interface TenderlyErrorResponse {
  error: TenderlyError;
}
const tenderlyError = async (res: Response) => {
  const { status, statusText } = res;
  const { error }: TenderlyErrorResponse = await res.json();
  throw new Error(`[${status} ${statusText}] ${error?.message}`);
};
