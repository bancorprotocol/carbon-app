import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { ReactNode } from 'react';
import { Connector } from '@web3-react/types';
import { AVAILABLE_CONNECTION_TYPES } from 'services/web3-react/connectors';
import { getConnection, getConnectionName } from 'services/web3-react/utils';

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const connectors: [Connector, Web3ReactHooks][] =
    AVAILABLE_CONNECTION_TYPES.map(getConnection).map(
      ({ hooks, connector }) => [connector, hooks]
    );

  const key = AVAILABLE_CONNECTION_TYPES.map((type) =>
    getConnectionName(type)
  ).join('-');

  return (
    <Web3ReactProvider connectors={connectors} key={key}>
      {children}
    </Web3ReactProvider>
  );
};
