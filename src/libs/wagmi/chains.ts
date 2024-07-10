import { type Chain } from 'viem';
import config from 'config';
import { CHAIN_ID, RPC_HEADERS, RPC_URLS } from './wagmi.constants';
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
      http: [config.network.walletConnectRpc.url],
    },
  },
  blockExplorers: {
    default: {
      name: config.network.blockExplorer.name,
      url: config.network.blockExplorer.url,
    },
  },
  contracts: { ...config.utils },
};

export const configChains: [Chain, ...Chain[]] = [currentChain];

export const configTransports = {
  [currentChain.id]: http(RPC_URLS[CHAIN_ID], {
    fetchOptions: {
      headers: RPC_HEADERS[CHAIN_ID],
    },
  }),
};
