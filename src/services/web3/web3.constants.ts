import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ChainIdMapTo } from 'services/web3';

const ALCHEMY_URL = 'https://eth-mainnet.alchemyapi.io/v2/';
const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY;
if (typeof ALCHEMY_KEY === 'undefined') {
  throw new Error(
    `REACT_APP_ALCHEMY_KEY must be a defined environment variable`
  );
}

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
  ConnectionType.COINBASE_WALLET,
  ConnectionType.WALLET_CONNECT,
];

export const RPC_URLS: ChainIdMapTo<string> = {
  [SupportedChainId.MAINNET]: `${ALCHEMY_URL}${ALCHEMY_KEY}`,
};

export const RPC_PROVIDERS: ChainIdMapTo<StaticJsonRpcProvider> = {
  [SupportedChainId.MAINNET]: new StaticJsonRpcProvider(
    RPC_URLS[SupportedChainId.MAINNET]
  ),
};
