import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { FC, ReactNode } from 'react';
import { Connector } from '@web3-react/types';
import { BancorWeb3Provider } from 'libs/web3/Web3Provider';
import { SELECTABLE_CONNECTION_TYPES } from 'libs/web3/web3.constants';
import { getConnection } from 'libs/web3/web3.utils';

// ********************************** //
// WEB3 REACT LIBRARY WRAPPER
// ********************************** //

const connectors: [Connector, Web3ReactHooks][] =
  SELECTABLE_CONNECTION_TYPES.map(getConnection).map(({ hooks, connector }) => [
    connector,
    hooks,
  ]);

const key = 'Web3ReactProviderKey';

export const Web3ReactWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Web3ReactProvider connectors={connectors} key={key}>
      <BancorWeb3Provider>{children}</BancorWeb3Provider>
    </Web3ReactProvider>
  );
};
