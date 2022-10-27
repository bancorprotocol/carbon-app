import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ChainIdMapTo } from './web3.types';
import { lsService } from 'services/localeStorage';

const ALCHEMY_URL = 'https://eth-mainnet.alchemyapi.io/v2/';
const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY;
if (typeof ALCHEMY_KEY === 'undefined') {
  throw new Error(
    `REACT_APP_ALCHEMY_KEY must be a defined environment variable`
  );
}

const TENDERLY_RPC = lsService.getItem('tenderlyRpc');
export const IS_TENDERLY_FORK = !!TENDERLY_RPC;

export const IS_IMPOSTER_ACCOUNT = !!lsService.getItem('imposterAccount');

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
  [SupportedChainId.MAINNET]: TENDERLY_RPC
    ? TENDERLY_RPC
    : `${ALCHEMY_URL}${ALCHEMY_KEY}`,
};

export const RPC_PROVIDERS: ChainIdMapTo<StaticJsonRpcProvider> = {
  [SupportedChainId.MAINNET]: new StaticJsonRpcProvider(
    RPC_URLS[SupportedChainId.MAINNET]
  ),
};
