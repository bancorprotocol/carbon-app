import { useWeb3 } from 'libs/web3';
import { Token__factory } from 'abis/types';
import { useCallback } from 'react';

export const useContract = () => {
  const { provider, signer } = useWeb3();

  const Token = useCallback(
    (address: string) => ({
      read: Token__factory.connect(address, provider!),
      write: Token__factory.connect(address, signer!),
    }),
    [provider, signer]
  );

  return { Token };
};
