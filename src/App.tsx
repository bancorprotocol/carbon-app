import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { getConnection, getConnectionName } from 'services/web3-react/utils';
import {
  AVAILABLE_CONNECTION_TYPES,
  ConnectionType,
} from 'services/web3-react/connectors';

export const App = () => {
  const { account } = useWeb3React();

  const connect = (type: ConnectionType) => {
    const connection = getConnection(type);
    connection.connector.activate();
  };

  return (
    <div>
      <h1 className={'text-red-600'}>Hello</h1>
      <div>
        <div className={'flex flex-col space-y-1'}>
          {AVAILABLE_CONNECTION_TYPES.map((type) => (
            <button
              key={type}
              className={'bg-sky-500 px-2 text-white'}
              onClick={() => connect(type)}
            >
              {getConnectionName(type, true)} connect
            </button>
          ))}

          <div>{account ? account : 'not logged in'}</div>
        </div>
      </div>
    </div>
  );
};
