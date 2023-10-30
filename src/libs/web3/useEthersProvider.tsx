import * as React from 'react';
import { type PublicClient, usePublicClient } from 'wagmi';
import { providers } from 'ethers';
import { type HttpTransport } from 'viem';

export const publicClientToProvider = (publicClient: PublicClient) => {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === 'fallback') {
    const transports = transport.transports as ReturnType<HttpTransport>[];
    const fallback = transports.map(({ value }) => {
      return new providers.JsonRpcProvider(value?.url, network);
    });
    return new providers.FallbackProvider(fallback);
  }
  return new providers.JsonRpcProvider(transport.url, network);
};

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export const useEthersProvider = ({ chainId }: { chainId?: number } = {}) => {
  const publicClient = usePublicClient({ chainId });
  return React.useMemo(
    () => publicClientToProvider(publicClient),
    [publicClient]
  );
};
