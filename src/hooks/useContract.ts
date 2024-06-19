import { useWagmi } from 'libs/wagmi';
import { Token__factory, Voucher__factory } from 'abis/types';
import { useCallback, useMemo } from 'react';
import config from 'config';

export const useContract = () => {
  const { provider, signer } = useWagmi();

  const Token = useCallback(
    (address: string) => ({
      read: Token__factory.connect(address, provider!),
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
