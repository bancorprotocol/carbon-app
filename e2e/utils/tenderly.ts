import { Page } from '@playwright/test';

const TENDERLY_ACCOUNT = process.env['TENDERLY_ACCOUNT'];
if (!TENDERLY_ACCOUNT) throw new Error('No TENDERLY_ACCOUNT provided in .env');
const TENDERLY_PROJECT = process.env['TENDERLY_PROJECT'];
if (!TENDERLY_PROJECT) throw new Error('No TENDERLY_PROJECT provided in .env');
const TENDERLY_ACCESS_KEY = process.env['TENDERLY_ACCESS_KEY'];
if (!TENDERLY_ACCESS_KEY)
  throw new Error('No TENDERLY_ACCESS_KEY provided in .env');

const baseUrl = `https://api.tenderly.co/api/v1/account/${TENDERLY_ACCOUNT}/project/${TENDERLY_PROJECT}/vnets`;
const headers = {
  'Content-Type': 'application/json',
  'X-Access-Key': TENDERLY_ACCESS_KEY,
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

/** See https://docs.tenderly.co/reference/api#/operations/createVnet */
export interface CreateVirtualNetworkBody {
  slug: string;
  display_name?: string;
  description?: string;
  fork_config: {
    network_id: number;
    block_number: string;
  };
  virtual_network_config: {
    chain_config: {
      chain_id: number;
    };
  };
  sync_state_config?: {
    enabled?: boolean;
  };
  explorer_page_config?: {
    enabled?: boolean;
    verification_visibility?: 'bytecode' | 'src' | 'abi';
  };
}

/** See https://docs.tenderly.co/reference/api#/operations/createVnet#Responses */
export interface CreateVirtualNetworkResponse {
  id: string;
  slug: string;
  rpcs: {
    url: string;
    name: string;
  }[];
}

export const createVirtualNetwork = async (body: CreateVirtualNetworkBody) => {
  body.slug += `-${crypto.randomUUID()}`;
  const req = new Request(baseUrl, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  });
  const clone = req.clone();
  const res = await fetch(req);
  if (!res.ok) return tenderlyError(clone, res);
  return res.json() as Promise<CreateVirtualNetworkResponse>;
};

export interface GetForkResponse {
  simulation_fork: Fork;
}

export const waitForTenderlyRpc = (page: Page, timeout?: number) => {
  const tenderlyRegExp = /.*rpc\.tenderly\.co.*$/;
  return page.waitForResponse(tenderlyRegExp, { timeout });
};

export const getVirtualNetwork = async (id: string) => {
  const req = new Request(`${baseUrl}/${id}`, {
    method: 'GET',
    headers,
  });
  const clone = req.clone();
  const res = await fetch(req);
  if (!res.ok) return tenderlyError(clone, res);
  return res.json();
};

export const deleteVirtualNetwork = async (id: string) => {
  const req = new Request(`${baseUrl}/${id}`, {
    method: 'DELETE',
    headers,
  });
  const clone = req.clone();
  const res = await fetch(req);
  if (!res.ok) return tenderlyError(clone, res);
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
const tenderlyError = async (req: Request, res: Response) => {
  const { status, statusText } = res;
  const { error }: TenderlyErrorResponse = await res.json();
  const body = await req.text();
  const message = {
    res: `[${status} ${statusText}] ${error?.message}`,
    req: `[${req.url}] ${body}`,
  };
  throw new Error(JSON.stringify(message));
};
