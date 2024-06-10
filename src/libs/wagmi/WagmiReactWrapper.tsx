import { FC, ReactNode } from 'react';
import { CarbonWagmiProvider } from 'libs/wagmi/WagmiProvider';
import { wagmiConfig } from 'libs/wagmi/config';
import { WagmiProvider } from 'wagmi';

export const WagmiReactWrapper: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <CarbonWagmiProvider>{children}</CarbonWagmiProvider>
    </WagmiProvider>
  );
};
