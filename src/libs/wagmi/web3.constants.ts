import { ChainIdMapTo, SelectableConnectionType } from 'libs/wagmi/web3.types';
import config from 'config';
import { tenderlyRpc } from 'utils/tenderly';

const CHAIN_RPC_URL = tenderlyRpc || config.network.rpc.url;
const CHAIN_RPC_HEADERS = tenderlyRpc ? {} : config.network.rpc.headers || {};
const CHAIN_ID = config.network.chainId;

if (typeof CHAIN_RPC_URL === 'undefined') {
  throw new Error(`rpcUrl must be defined in config folder`);
}

export const IS_TENDERLY_FORK = !!tenderlyRpc;

export enum EnumConnectionType {
  METAMASK,
  COINBASE_WALLET,
  WALLET_CONNECT,
  GNOSIS_SAFE,
}

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
