import { type Chain } from 'viem';
import config from 'config';
import { RPC_HEADERS, RPC_URLS, SupportedChainId } from './web3.constants';
import { http } from 'wagmi';

export const currentChain: Chain = {
  id: config.network.chainId,
  name: config.network.name,
  nativeCurrency: {
    name: config.network.gasToken.name,
    symbol: config.network.gasToken.symbol,
    decimals: config.network.gasToken.decimals,
  },
  rpcUrls: {
    default: {
      http: [config.network.rpc.url],
    },
  },
  blockExplorers: {
    default: {
      name: config.network.blockExplorer.name,
      url: config.network.blockExplorer.url,
    },
  },
};

export const configChains: [Chain, ...Chain[]] = [currentChain];

export const configTransports = {
  [currentChain.id]: http(RPC_URLS[SupportedChainId.MAINNET], {
    fetchOptions: {
      headers: RPC_HEADERS[SupportedChainId.MAINNET],
    },
  }),
};
