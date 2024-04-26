import { ChainIdMapTo } from 'libs/web3/web3.types';
import { lsService } from 'services/localeStorage';
import config from 'config';

const TENDERLY_RPC = lsService.getItem('tenderlyRpc');
const CHAIN_RPC_URL = TENDERLY_RPC || config.rpcUrl;
const CHAIN_ID = TENDERLY_RPC ? 1 : config.network.chainId;

if (typeof CHAIN_RPC_URL === 'undefined') {
  throw new Error(`rpcUrl must be defined in config folder`);
}

export const IS_TENDERLY_FORK = !!TENDERLY_RPC;

export enum SupportedChainId {
  MAINNET = CHAIN_ID,
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
