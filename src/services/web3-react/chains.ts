import { StaticJsonRpcProvider } from '@ethersproject/providers';

const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY;
if (typeof ALCHEMY_KEY === 'undefined') {
  throw new Error(
    `REACT_APP_ALCHEMY_KEY must be a defined environment variable`
  );
}

export enum SupportedChainId {
  MAINNET = 1,
}

export const RPC_URLS: { [key in SupportedChainId]: string[] } = {
  [SupportedChainId.MAINNET]: [`https://mainnet.infura.io/v3/${ALCHEMY_KEY}`],
};

export const RPC_PROVIDERS: {
  [key in SupportedChainId]: StaticJsonRpcProvider;
} = {
  [SupportedChainId.MAINNET]: new StaticJsonRpcProvider(
    RPC_URLS[SupportedChainId.MAINNET][0]
  ),
};
