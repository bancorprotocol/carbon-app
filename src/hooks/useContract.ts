import { useWeb3 } from 'web3';
import {
  Token__factory,
  PoolCollection__factory,
  BancorNetwork__factory,
} from 'abis/types';
import { useCallback, useMemo } from 'react';

import PoolCollectionProxyAbi from 'abis/PoolCollection_Proxy.json';
import BancorNetworkProxyAbi from 'abis/BancorNetwork_Proxy.json';

export const useContract = () => {
  const { provider, signer } = useWeb3();

  const Token = useCallback(
    (address: string) => ({
      read: Token__factory.connect(address, provider!),
      write: Token__factory.connect(address, signer!),
    }),
    [provider, signer]
  );

  const PoolCollection = useMemo(
    () => ({
      read: PoolCollection__factory.connect(
        PoolCollectionProxyAbi.address,
        provider!
      ),
      write: PoolCollection__factory.connect(
        PoolCollectionProxyAbi.address,
        signer!
      ),
    }),
    [provider, signer]
  );

  const BancorNetwork = useMemo(
    () => ({
      read: BancorNetwork__factory.connect(
        BancorNetworkProxyAbi.address,
        provider!
      ),
      write: BancorNetwork__factory.connect(
        BancorNetworkProxyAbi.address,
        signer!
      ),
    }),
    [provider, signer]
  );

  return { Token, PoolCollection, BancorNetwork };
};
