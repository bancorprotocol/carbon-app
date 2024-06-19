import { createConfig } from 'wagmi';
import { configConnectors } from './connectors';
import { configChains, configTransports } from './chains';

export const wagmiConfig = createConfig({
  chains: configChains,
  syncConnectedChain: true,
  connectors: configConnectors,
  transports: configTransports,
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
