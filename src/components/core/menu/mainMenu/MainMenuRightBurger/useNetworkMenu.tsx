import { useMemo } from 'react';
import { networkConfigs, network as currentNetworkId } from 'config';

export const useNetworkMenu = () => {
  const networks = useMemo(
    () =>
      Object.entries(networkConfigs).map(([id, config]) => {
        return {
          id,
          name: config.network.name,
          logoUrl: config.network.logoUrl,
          isCurrentNetwork: currentNetworkId === id,
          selectNetwork: () => {
            window.location.href = config.appUrl;
          },
        };
      }),
    []
  );

  return { networks };
};
