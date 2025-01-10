import { useWagmi } from 'libs/wagmi';
import { Token__factory, Voucher__factory, Batcher__factory } from 'abis/types';
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import config from 'config';

export const useVoucher = () => {
  const { provider, signer } = useWagmi();
  const address = config.addresses.carbon.voucher;
  return useQuery({
    queryKey: ['contract', 'voucher'],
    queryFn: () => ({
      read: Voucher__factory.connect(address, provider!),
      write: Voucher__factory.connect(config.addresses.carbon.voucher, signer!),
    }),
  });
};

export const useBatcher = () => {
  const { provider, signer } = useWagmi();
  const address = config.addresses.carbon.batcher;
  return useQuery({
    queryKey: ['contract', 'batcher'],
    queryFn: () => ({
      read: Batcher__factory.connect(address!, provider!),
      write: Batcher__factory.connect(address!, signer!),
    }),
    enabled: !!address,
  });
};

export const useContract = () => {
  const { provider, signer } = useWagmi();

  const Token = useCallback(
    (address: string) => ({
      read: Token__factory.connect(address, provider!),
      write: Token__factory.connect(address, signer!),
    }),
    [provider, signer]
  );

  return { Token };
};
