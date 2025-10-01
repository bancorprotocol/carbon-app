import { currentChain, useWagmi } from 'libs/wagmi';
import { Token__factory, Voucher__factory } from 'abis/types';
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { getEthersProvider } from 'libs/wagmi/ethers';
import { wagmiConfig } from 'libs/wagmi/config';

export const useVoucher = () => {
  const { provider, signer } = useWagmi();
  const address = config.addresses.carbon.voucher;
  return useQuery({
    queryKey: ['contract', 'voucher'],
    queryFn: () => ({
      read: Voucher__factory.connect(address, provider!),
      write: Voucher__factory.connect(config.addresses.carbon.voucher, signer!),
    }),
    refetchOnWindowFocus: false,
  });
};

// TODO: remove this to use a centralize provider
// Use contract is used in StoreProvider which is above WagmiProvider, in these case we need to fallback on a defaultProvider
// A better solution would be not to use useContract in StoreProvider
const defaultProvider = () => {
  const chainId = currentChain.id;
  return getEthersProvider(wagmiConfig, chainId);
};

export const useContract = () => {
  const { provider, signer } = useWagmi();

  const Token = useCallback(
    (address: string) => ({
      read: Token__factory.connect(address, provider ?? defaultProvider()),
      write: Token__factory.connect(address, signer!),
    }),
    [provider, signer],
  );

  return { Token };
};
