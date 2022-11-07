import { useWeb3 } from 'web3';
import { Token__factory, PoolCollection__factory } from 'abis/types';
import { useCallback } from 'react';

// TODO: can I really trust this address?
import PoolCollectionAbi from 'abis/PoolCollection.json';
export const useContract = () => {
  const { provider, signer } = useWeb3();

  const Token = useCallback(
    (address: string) => ({
      read: Token__factory.connect(address, provider!),
      write: Token__factory.connect(address, signer!),
    }),
    [provider, signer]
  );

  const PoolCollection = useCallback(
    (address: string = PoolCollectionAbi.address) => ({
      read: PoolCollection__factory.connect(address, provider!),
      write: PoolCollection__factory.connect(address, signer!),
    }),
    [provider, signer]
  );

  return { Token, PoolCollection };
};
