import { useWeb3 } from 'providers/Web3Provider';
import { Token__factory } from 'abis/types/index';
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
