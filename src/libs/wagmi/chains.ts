import { type Chain } from 'viem';
import config from 'config';
import { CHAIN_ID, RPC_HEADERS, RPC_URLS } from './wagmi.constants';
import { http } from 'wagmi';

// Native Currency Symbol
// Remove content in parenthesis
// Symbol must be 2-6 characters to add new network
// @todo(#1417) refactor this implementation to use the gasToken symbol in a different way
const nativeCurrencySymbol = config.network.gasToken.symbol
  .replace(/\s*\(.*?\)\s*/g, '')
  .substring(0, 6);

export const currentChain: Chain = {
  id: config.network.chainId,
  name: config.network.name,
  nativeCurrency: {
    name: config.network.gasToken.name,
    symbol: nativeCurrencySymbol,
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
  contracts: { ...config.utils },
};

export const configChains: [Chain, ...Chain[]] = [currentChain];

export const configTransports = {
  [currentChain.id]: http(RPC_URLS[CHAIN_ID], {
    fetchOptions: {
      headers: RPC_HEADERS[CHAIN_ID],
    },
    batch: {
      batchSize: config.network.rpc.batchSize,
      wait: config.network.rpc.wait,
    },
  }),
};
