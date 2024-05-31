import { useWeb3 } from 'libs/web3';
import { Token__factory, Voucher__factory } from 'abis/types';
import { useCallback, useMemo } from 'react';
import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import config from 'config';

export const tokenRead = (address: string, provider: Provider) => {
  return Token__factory.connect(address, provider!);
};
export const tokenWrite = (address: string, signer: Signer) => {
  return Token__factory.connect(address, signer!);
};

export const useContract = () => {
  const { provider, signer } = useWeb3();

  const Token = useCallback(
    (address: string) => ({
      read: tokenRead(address, provider!),
      write: Token__factory.connect(address, signer!),
    }),
    [provider, signer]
  );

  const Voucher = useMemo(
    () => ({
      read: Voucher__factory.connect(
        config.addresses.carbon.voucher,
        provider!
      ),
      write: Voucher__factory.connect(config.addresses.carbon.voucher, signer!),
    }),
    [provider, signer]
  );

  return { Token, Voucher };
};
