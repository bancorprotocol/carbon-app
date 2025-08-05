import { useSwitchChain } from 'wagmi';
import { getEthersProvider } from 'libs/wagmi/ethers';
import { wagmiConfig } from 'libs/wagmi/config';
import { JsonRpcProvider } from 'ethers';
import { getConnectors } from '@wagmi/core';
import { RPC_URLS, CHAIN_ID } from 'libs/wagmi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { currentChain } from './chains';
import { blocklistConnectors, selectedConnectors } from './wagmi.constants';
import { isPlaceHolderConnector, providerRdnsToName } from './connectors';

export const useWagmiNetwork = () => {
  const { switchChain } = useSwitchChain();
  const chainId = currentChain.id;

  const provider = getEthersProvider(wagmiConfig, chainId);

  const [isNetworkActive, setIsNetworkActive] = useState(false);

  const [networkError, setNetworkError] = useState<string>();

  const switchNetwork = () => switchChain({ chainId });

  const activateNetwork = useCallback(async () => {
    if (networkError || isNetworkActive) {
      return;
    }

    try {
      const networkProvider =
        provider ||
        new JsonRpcProvider(RPC_URLS[CHAIN_ID], chainId, {
          staticNetwork: true,
        });
      await networkProvider.getNetwork();
      setIsNetworkActive(true);
    } catch (e: any) {
      const msg = e.message || 'Could not activate network: UNKNOWN ERROR';
      console.error('activateNetwork failed.', msg);
      setNetworkError(msg);
    }
  }, [chainId, isNetworkActive, networkError, provider]);

  useEffect(() => {
    activateNetwork();
  }, [activateNetwork]);

  const wagmiConnectors = getConnectors(wagmiConfig);
  const connectors = useMemo(() => {
    const wagmiConnectorsNames = wagmiConnectors
      .map((c) => providerRdnsToName(c.id) || c.name)
      .map((name) => name.toLowerCase());

    const duplicatedConnectorNames = wagmiConnectorsNames.filter(
      (e, i, a) => a.indexOf(e) !== i,
    );
    const unsortedConnectors = wagmiConnectors.filter(
      (c) =>
        !(
          duplicatedConnectorNames.includes(c.name.toLowerCase()) &&
          isPlaceHolderConnector(c)
        ) && !blocklistConnectors.includes(c.name.toLowerCase()),
    );
    const connectionOrder = (selectedConnectors as string[]).map((c) =>
      c.toLowerCase(),
    );
    return [...unsortedConnectors].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (!connectionOrder.includes(nameA) || !connectionOrder.includes(nameB))
        return connectionOrder.indexOf(nameB) - connectionOrder.indexOf(nameA);
      return connectionOrder.indexOf(nameA) - connectionOrder.indexOf(nameB);
    });
  }, [wagmiConnectors]);

  return {
    chainId,
    provider,
    connectors,
    isNetworkActive,
    networkError,
    switchNetwork,
  };
};
