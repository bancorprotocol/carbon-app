// import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
// import { FC, ReactNode } from 'react';
// import { Connector } from '@web3-react/types';
// import { CarbonWeb3Provider } from 'libs/web3/Web3Provider';
// import { selectableConnectionTypes } from 'libs/web3/web3.constants';
// import { getConnection } from 'libs/web3/web3.utils';

// // ********************************** //
// // WEB3 REACT LIBRARY WRAPPER
// // ********************************** //

// const connectors: [Connector, Web3ReactHooks][] = selectableConnectionTypes
//   .map(getConnection)
//   .map(({ hooks, connector }) => [connector, hooks]);

// const key = 'Web3ReactProviderKey';

// export const Web3ReactWrapper: FC<{ children: ReactNode }> = ({ children }) => {
//   return (
//     <Web3ReactProvider connectors={connectors} key={key}>
//       <CarbonWeb3Provider>{children}</CarbonWeb3Provider>
//     </Web3ReactProvider>
//   );
// };

import { FC, ReactNode } from 'react';
import { createPublicClient, http } from 'viem';
import { createConfig, WagmiConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';

// ********************************** //
// WAGMI LIBRARY WRAPPER
// ********************************** //

export const RPC_URLS = {
  [mainnet.id]: import.meta.env.VITE_CHAIN_RPC_URL,
} as const;

const wagmiConfig = createConfig({
  autoConnect: true,
  // connectors,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(RPC_URLS[mainnet.id as keyof typeof RPC_URLS]),
  }),
});

const key = 'Web3ReactProviderKey';

export const Web3ReactWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig} key={key}>
      {children}
    </WagmiConfig>
  );
};
