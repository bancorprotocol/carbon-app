import { ChainIdMapTo } from 'libs/web3/web3.types';
import { lsService } from 'services/localeStorage';

const TENDERLY_RPC = lsService.getItem('tenderlyRpc');
const CHAIN_RPC_URL = TENDERLY_RPC || import.meta.env.VITE_CHAIN_RPC_URL;

if (typeof CHAIN_RPC_URL === 'undefined') {
  throw new Error(`VITE_CHAIN_RPC_URL must be a defined environment variable`);
}

export const IS_TENDERLY_FORK = !!TENDERLY_RPC;

export enum SupportedChainId {
  MAINNET = 1,
}

// [START] Used for localstorage migration: Remove it after Nov 2023
export enum EnumConnectionType {
  INJECTED,
  COINBASE_WALLET,
  WALLET_CONNECT,
  NETWORK,
  GNOSIS_SAFE,
}
const connectionTypeMapping: Record<EnumConnectionType, ConnectionType> = {
  [EnumConnectionType.INJECTED]: 'injected',
  [EnumConnectionType.COINBASE_WALLET]: 'coinbaseWallet',
  [EnumConnectionType.WALLET_CONNECT]: 'walletConnect',
  [EnumConnectionType.NETWORK]: 'network',
  [EnumConnectionType.GNOSIS_SAFE]: 'gnosisSafe',
};
const isEnumConnectionType = (
  type: ConnectionType | EnumConnectionType
): type is EnumConnectionType => type in connectionTypeMapping;

export const getConnectionTypeFromLS = () => {
  const type = lsService.getItem('connectionType');
  if (type === undefined) return;
  return isEnumConnectionType(type) ? connectionTypeMapping[type] : type;
};
// [END]

export type ConnectionType =
  | 'network'
  | (typeof selectableConnectionTypes)[number];

export const selectableConnectionTypes = [
  'injected',
  'walletConnect',
  'coinbaseWallet',
  'gnosisSafe',
] as const;

export const RPC_URLS: ChainIdMapTo<string> = {
  [SupportedChainId.MAINNET]: CHAIN_RPC_URL,
};
