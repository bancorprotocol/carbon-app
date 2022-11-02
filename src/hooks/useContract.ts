import { useWeb3 } from 'web3';
import { PoolCollection__factory, Token__factory } from 'abis/types';
import { useCallback, useMemo } from 'react';
import poolCollectionProxy from 'abis/PoolCollection_Proxy.json';

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
        poolCollectionProxy.address,
        provider!
      ),
      write: PoolCollection__factory.connect(
        poolCollectionProxy.address,
        signer!
      ),
    }),
    [provider, signer]
  );

  return { Token, PoolCollection };
};
