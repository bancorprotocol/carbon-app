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

export enum ConnectionType {
  INJECTED,
  COINBASE_WALLET,
  WALLET_CONNECT,
  NETWORK,
  GNOSIS_SAFE,
}

export const SELECTABLE_CONNECTION_TYPES: ConnectionType[] = [
  ConnectionType.INJECTED,
  ConnectionType.WALLET_CONNECT,
  ConnectionType.COINBASE_WALLET,
  ConnectionType.GNOSIS_SAFE,
];

export const RPC_URLS: ChainIdMapTo<string> = {
  [SupportedChainId.MAINNET]: CHAIN_RPC_URL,
};
