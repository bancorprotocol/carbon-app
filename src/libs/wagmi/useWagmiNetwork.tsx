import { getChainInfo } from 'libs/wagmi/web3.utils';
import { useSwitchChain } from 'wagmi';
import { getEthersProvider } from 'libs/wagmi/ethers';
import { wagmiConfig } from 'libs/wagmi/config';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { getConnectors } from '@wagmi/core';
import { RPC_URLS, RPC_HEADERS, SupportedChainId } from 'libs/wagmi';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useWagmiNetwork = () => {
  const { switchChain } = useSwitchChain();
  const chainId = getChainInfo().chainId;

  const provider = getEthersProvider(wagmiConfig, { chainId });

  const [isNetworkActive, setIsNetworkActive] = useState(false);

  const [networkError, setNetworkError] = useState<string>();

  const switchNetwork = () => switchChain({ chainId });

  const networkProvider = useMemo(() => {
    return new StaticJsonRpcProvider(
      {
        url: RPC_URLS[SupportedChainId.MAINNET],
        headers: RPC_HEADERS[SupportedChainId.MAINNET],
        skipFetchSetup: true,
      },
      chainId
    );
  }, [chainId]);

  const activateNetwork = useCallback(async () => {
    if (networkError || isNetworkActive) {
      return;
    }

    try {
      await networkProvider.getNetwork();
      setIsNetworkActive(true);
    } catch (e: any) {
      const msg = e.message || 'Could not activate network: UNKNOWN ERROR';
      console.error('activateNetwork failed.', msg);
      setNetworkError(msg);
    }
  }, [isNetworkActive, networkError, networkProvider]);

  useEffect(() => {
    void activateNetwork();
  }, [activateNetwork]);

  const connectors = getConnectors(wagmiConfig);

  return {
    provider,
    connectors,
    isNetworkActive,
    networkError,
    switchNetwork,
  };
};
