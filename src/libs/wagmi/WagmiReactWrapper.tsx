import { FC, ReactNode } from 'react';
import { CarbonWagmiProvider } from 'libs/wagmi/WagmiProvider';
import { wagmiConfig } from 'libs/wagmi/config';
import { WagmiProvider } from 'wagmi';

export const WagmiReactWrapper: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    // Do not reconnect on mount to prevent HMR issues reconnectOnMount={false}
    <WagmiProvider config={wagmiConfig} reconnectOnMount={!import.meta.env.DEV}>
      <CarbonWagmiProvider>{children}</CarbonWagmiProvider>
    </WagmiProvider>
  );
};
