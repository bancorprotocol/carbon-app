import { FC, ReactNode } from 'react';
import { CarbonWeb3Provider } from 'libs/wagmi/WagmiProvider';
import { wagmiConfig } from 'libs/wagmi/config';
import { WagmiProvider } from 'wagmi';

export const WagmiReactWrapper: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <CarbonWeb3Provider>{children}</CarbonWeb3Provider>
    </WagmiProvider>
  );
};
