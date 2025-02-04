import { SelectableConnectionName } from 'libs/wagmi/wagmi.types';
import config from 'config';
import { tenderlyRpc } from 'utils/tenderly';
import { lsService } from 'services/localeStorage';

const configOverride = lsService.getItem('configOverride');

const IS_ENV_RPC = !!import.meta.env.VITE_CHAIN_RPC_URL;

const CHAIN_RPC_URL =
  tenderlyRpc ||
  configOverride?.network?.rpc.url ||
  import.meta.env.VITE_CHAIN_RPC_URL ||
  config.network.rpc.url;

const CHAIN_RPC_HEADERS =
  tenderlyRpc || IS_ENV_RPC ? {} : config.network.rpc?.headers || {};
export const CHAIN_ID = config.network.chainId;

if (typeof CHAIN_RPC_URL === 'undefined') {
  throw new Error(`rpcUrl must be defined in config folder`);
}

export const IS_TENDERLY_FORK = !!tenderlyRpc;

export const RPC_URLS = {
  [CHAIN_ID]: CHAIN_RPC_URL,
};
export const RPC_HEADERS = {
  [CHAIN_ID]: CHAIN_RPC_HEADERS,
};

export const selectedConnectors: SelectableConnectionName[] =
  config.selectedConnectors;

export const blocklistConnectors: string[] =
  config.blockedConnectors?.map((c) => c.toLowerCase()) || [];

export const providerMapRdnsToName: Record<string, SelectableConnectionName> = {
  'tailwind.zone': 'Tailwind',
  'io.metamask': 'MetaMask',
  'io.metamask.mobile': 'MetaMask',
  'io.leapwallet.CompassWallet': 'Compass Wallet',
  'com.coinbase.wallet': 'Coinbase Wallet',
  'com.passkeywallet.seif': 'Seif',
  safe: 'Safe', // does not inject provider
  walletConnect: 'WalletConnect', // does not inject provider
};
