import { useWeb3 } from 'libs/web3';
import { Token__factory, Voucher__factory } from 'abis/types';
import { useCallback, useMemo } from 'react';
import { config } from 'services/web3/config';

export const useContract = () => {
  const { provider, signer } = useWeb3();

  const Token = useCallback(
    (address: string) => ({
      read: Token__factory.connect(address, provider!),
      write: Token__factory.connect(address, signer!),
    }),
    [provider, signer]
  );

  const Voucher = useMemo(
    () => ({
      read: Voucher__factory.connect(config.carbon.voucher, provider!),
      write: Voucher__factory.connect(config.carbon.voucher, signer!),
    }),
    [provider, signer]
  );

  return { Token, Voucher };
};
