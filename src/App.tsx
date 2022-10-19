import React from 'react';
import {
  getConnection,
  getConnectionName,
} from 'services/web3-react/web3.utils';
import { Token__factory } from 'abis/types/index';
import {
  SELECTABLE_CONNECTION_TYPES,
  ConnectionType,
} from 'services/web3-react/web3.constants';
import { useWeb3 } from 'services/web3-react/Web3Provider';

export const bntToken: string = '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C';

export const App = () => {
  const { isNetworkActive, provider, user } = useWeb3();

  const connect = (type: ConnectionType) => {
    const connection = getConnection(type);
    connection.connector.activate();
  };

  const readChain = async () => {
    if (!provider) {
      throw Error('not provider set.');
    }
    try {
      const read = Token__factory.connect(bntToken, provider);
      const decimals = await read.decimals();
      console.log('decimals', decimals);
      // const res = selectedProvider.
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1 className={'text-red-600'}>Hello</h1>
      <div>
        <button onClick={() => readChain()}>read chain</button>
        {isNetworkActive ? 'true' : 'false'}
      </div>
      <div>
        <div className={'flex flex-col space-y-1'}>
          {SELECTABLE_CONNECTION_TYPES.map((type) => (
            <button
              key={type}
              className={'bg-sky-500 px-2 text-white'}
              onClick={() => connect(type)}
            >
              {getConnectionName(type, true)} connect
            </button>
          ))}

          <div>{user ? user : 'not logged in'}</div>
        </div>
      </div>
    </div>
  );
};
