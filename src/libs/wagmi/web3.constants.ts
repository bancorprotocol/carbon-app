import { ChainIdMapTo } from 'libs/wagmi/web3.types';
import { lsService } from 'services/localeStorage';
import config from 'config';

const TENDERLY_RPC = lsService.getItem('tenderlyRpc');
const CHAIN_RPC_URL = TENDERLY_RPC || config.network.rpc.url;
const CHAIN_RPC_HEADERS = TENDERLY_RPC ? {} : config.network.rpc.headers || {};
const CHAIN_ID = config.network.chainId;

if (typeof CHAIN_RPC_URL === 'undefined') {
  throw new Error(`rpcUrl must be defined in config folder`);
}

export const IS_TENDERLY_FORK = !!TENDERLY_RPC;

export type SelectableConnectionType =
  | 'MetaMask'
  | 'WalletConnect'
  | 'Coinbase Wallet'
  | 'safe'
  | 'Tailwind Wallet'
  | 'Compass Wallet'
  | 'Seif Wallet';

// [START] Used for localstorage migration: Remove it after Nov 2023
export enum EnumConnectionType {
  METAMASK,
  COINBASE_WALLET,
  WALLET_CONNECT,
  GNOSIS_SAFE,
}
const connectionTypeMapping: Record<
  EnumConnectionType,
  SelectableConnectionType
> = {
  [EnumConnectionType.METAMASK]: 'MetaMask',
  [EnumConnectionType.COINBASE_WALLET]: 'Coinbase Wallet',
  [EnumConnectionType.WALLET_CONNECT]: 'WalletConnect',
  [EnumConnectionType.GNOSIS_SAFE]: 'safe',
};
const isEnumConnectionType = (
  type: SelectableConnectionType | EnumConnectionType
): type is EnumConnectionType => type in connectionTypeMapping;

export const getConnectionTypeFromLS = () => {
  const type = lsService.getItem('connectionType');
  if (type === undefined) return;
  return isEnumConnectionType(type) ? connectionTypeMapping[type] : type;
};
// [END]

export enum SupportedChainId {
  MAINNET = CHAIN_ID,
}

export const selectedConnections: SelectableConnectionType[] =
  config.selectedConnections;

export const RPC_URLS: ChainIdMapTo<string> = {
  [SupportedChainId.MAINNET]: CHAIN_RPC_URL,
};
export const RPC_HEADERS: {
  [chainId: string]: Record<string, string>;
} = {
  [SupportedChainId.MAINNET]: CHAIN_RPC_HEADERS,
};
