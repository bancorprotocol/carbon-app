import { useWeb3 } from 'web3';
import {
  Token__factory,
  PoolCollection__factory,
  BancorNetwork__factory,
  Voucher__factory,
  Multicall__factory,
} from 'abis/types';
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

  const PoolCollection = useMemo(
    () => ({
      read: PoolCollection__factory.connect(
        config.carbon.poolCollection,
        provider!
      ),
      write: PoolCollection__factory.connect(
        config.carbon.poolCollection,
        signer!
      ),
    }),
    [provider, signer]
  );

  const BancorNetwork = useMemo(
    () => ({
      read: BancorNetwork__factory.connect(
        config.carbon.bancorNetwork,
        provider!
      ),
      write: BancorNetwork__factory.connect(
        config.carbon.bancorNetwork,
        signer!
      ),
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

  const Multicall = useMemo(
    () => ({
      read: Multicall__factory.connect(config.utils.multicall, provider!),
      write: Multicall__factory.connect(config.utils.multicall, signer!),
    }),
    [provider, signer]
  );

  return { Token, PoolCollection, BancorNetwork, Voucher, Multicall };
};
