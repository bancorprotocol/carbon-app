import { Token__factory, Voucher__factory } from 'abis/types';
import { useCallback, useMemo } from 'react';
import { config } from 'services/web3/config';
import { useEthersProvider } from 'libs/web3/useEthersProvider';
import { useEthersSigner } from 'libs/web3/useEthersSigner';

export const useContract = () => {
  const provider = useEthersProvider();
  const signer = useEthersSigner();

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
